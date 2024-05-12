import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/Addons.js";

abstract class Character {
    loader = new FBXLoader();
    loaded: boolean = false;
    onProgress = (xhr: any) => {
        if (xhr.lengthComputable) {
            let percentComplete = xhr.loaded / xhr.total * 100;
            if (percentComplete == 100) this.loaded = true;
            // console.log(percentComplete.toFixed(2) + '% downloaded');
        }
    };

    object: THREE.Group<THREE.Object3DEventMap> | undefined;
    collisionSphere: THREE.Sphere | undefined;
    mixer: THREE.AnimationMixer | undefined;
    actions: { [state: string]: THREE.AnimationAction } = {};
    currentState = '';

    run(dt: number, collisionTargets: THREE.Box3[], keyPressed: { [key: string]: boolean }) {
        this.mixer?.update(dt);
    }

    loadObjectFBX(scene: THREE.Scene, url: string, position?: THREE.Vector3) {
        this.loader.load(url, (object) => {
            this.mixer = new THREE.AnimationMixer(object);
            object.traverse(function (child) {
                if ((<THREE.Mesh>child).isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(object);
            this.object = object;
            if(position !== undefined) this.object.position.set(position.x, position.y, position.z);
        }, this.onProgress);
    }

    loadAnimationFBX(state: string, url: string) {
        if (typeof this.mixer !== "undefined") {
            this.loader.load(url, (object) => {
                const action = this.mixer!.clipAction(object.animations[0]);
                action.clampWhenFinished = true;
                action.play();
                this.actions[state] = action;
                this.#setWeight(state, 0);
            }, this.onProgress);
        }
        else setTimeout(() => { this.loadAnimationFBX(state, url) }, 250);
    }

    setInitState(state: string) {
        if (typeof this.actions[state] !== "undefined") {
            this.currentState = state;
            this.#setWeight(state, 1);
        }
        else setTimeout(() => { this.setInitState(state) }, 250);
    }

    // For Switching Animations
    crossFade(startAction: string, endAction: string, duration: number) {
        if (startAction == endAction) return;
        if (!this.actions[startAction] || !this.actions[endAction]) return;

        this.currentState = endAction;
        this.#setWeight(endAction, 1);
        this.actions[endAction].time = 0;
        this.actions[startAction].crossFadeTo(this.actions[endAction], duration, true);
    }
    #setWeight(state: string, weight: number) {
        this.actions[state].enabled = true;
        this.actions[state].setEffectiveTimeScale(1);
        this.actions[state].setEffectiveWeight(weight);
    }
}

export class Clown extends Character {
    v = 0;
    angle = 0;
    playerSpeed = 2;
    sight: any = new THREE.Raycaster();
    sightLeft: any = new THREE.Raycaster();
    sightRight: any = new THREE.Raycaster();

    constructor(scene: THREE.Scene, origin: THREE.Vector3) {
        super();
        this.loadObjectFBX(scene, './assets/clownRunning.fbx', origin);
        this.loadAnimationFBX('Idle', './assets/clownIdle.fbx');
        this.loadAnimationFBX('Running', './assets/clownRunning.fbx');
        this.loadAnimationFBX('Walking', './assets/clownWalking.fbx');
        this.setInitState('Idle');
        this.sight.far = 3250;
        this.sightLeft.far = 3250;
        this.sightRight.far = 3250;
        this.sight.firstHitOnly = true;
        this.sightLeft.firstHitOnly = true;
        this.sightRight.firstHitOnly = true;
        this.sight.set(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.sin(this.angle), 0, Math.cos(this.angle)).normalize()
        );
        this.sightLeft.set(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.sin(this.angle - Math.PI / 4), 0, Math.cos(this.angle - Math.PI / 4)).normalize()
        );
        this.sightRight.set(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(Math.sin(this.angle + Math.PI / 4), 0, Math.cos(this.angle + Math.PI / 4)).normalize()
        );
    }

    run(dt: number, collisionTargets: THREE.Box3[], keyPressed: { [key: string]: boolean }) {
        if (keyPressed['w']) {
            this.v = 1;
        } else {
            this.v = 0;
        }
        if (keyPressed['a']) {
            this.angle += (dt / 0.016) * 3 * Math.PI / 180;
        }
        if (keyPressed['d']) {
            this.angle -= (dt / 0.016) * 3 * Math.PI / 180;
        }
        if (keyPressed[' ']) {
            this.playerSpeed = 6;
        } else {
            this.playerSpeed = 2;
        }

        let prev_position = this.object?.position.clone();
        super.run(dt, collisionTargets, keyPressed);
        this.object?.rotation.set(0, this.angle, 0);
        this.object?.position.add(new THREE.Vector3((dt / 0.016) * this.playerSpeed * this.v * Math.sin(this.angle), 0, (dt / 0.016) * this.playerSpeed * this.v * Math.cos(this.angle)));
        this.collisionSphere = new THREE.Sphere(this.object?.position, 35);

        if (prev_position) {
            for (let collisionTarget of collisionTargets) {
                if (this.collisionSphere?.intersectsBox(collisionTarget)) {
                    this.object?.position.set(prev_position?.x, prev_position?.y, prev_position?.z);
                }
            }
        }

        if (this.v == 0) this.crossFade(this.currentState, 'Idle', 0.1);
        else if (this.playerSpeed == 2) this.crossFade(this.currentState, 'Walking', 0.1);
        else this.crossFade(this.currentState, 'Running', 0.1);
    }

    getDistanceToWall(walls: THREE.Object3D[]) {
        this.sight.set(
            this.object!.position,
            new THREE.Vector3(Math.sin(this.angle), 0, Math.cos(this.angle)).normalize()
        );
        this.sightLeft.set(
            this.object!.position,
            new THREE.Vector3(Math.sin(this.angle - Math.PI / 4), 0, Math.cos(this.angle - Math.PI / 4)).normalize()
        );
        this.sightRight.set(
            this.object!.position,
            new THREE.Vector3(Math.sin(this.angle + Math.PI / 4), 0, Math.cos(this.angle + Math.PI / 4)).normalize()
        );

        let results = [];
        let intersects = this.sightLeft.intersectObjects(walls);
        if (intersects.length == 0) results.push(this.sightLeft.far);
        else results.push(intersects[0].distance);
        intersects = this.sight.intersectObjects(walls);
        if (intersects.length == 0) results.push(this.sight.far);
        else results.push(intersects[0].distance);
        intersects = this.sightRight.intersectObjects(walls);
        if (intersects.length == 0) results.push(this.sightRight.far);
        else results.push(intersects[0].distance);
        return results;
    }
}

// bacteria

// idk