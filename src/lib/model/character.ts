import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/Addons.js";

abstract class Character {
    loader = new FBXLoader();
    onProgress = function (xhr: any) {
        if (xhr.lengthComputable) {
            let percentComplete = xhr.loaded / xhr.total * 100;
            // console.log(percentComplete.toFixed(2) + '% downloaded');
        }
    };

    object: THREE.Group<THREE.Object3DEventMap> | undefined;
    collisionBox: THREE.Box3 | undefined;
    mixer: THREE.AnimationMixer | undefined;
    actions: { [state: string]: THREE.AnimationAction } = {};
    currentState = '';

    run(dt: number, keyPressed: { [key: string]: boolean }) {
        this.mixer?.update(dt);
    }

    loadObjectFBX(scene: THREE.Scene, url: string) {
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
        if(!this.actions[startAction] || !this.actions[endAction]) return;

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

    constructor(scene: THREE.Scene) {
        super();
        this.loadObjectFBX(scene, './assets/clownRunning.fbx');
        this.loadAnimationFBX('Idle', './assets/clownIdle.fbx');
        this.loadAnimationFBX('Running', './assets/clownRunning.fbx');
        this.loadAnimationFBX('Walking', './assets/clownWalking.fbx');
        this.setInitState('Idle');
    }

    run(dt: number, keyPressed: { [key: string]: boolean }) {
        super.run(dt, keyPressed);
        this.object?.rotation.set(0, this.angle, 0);
        this.object?.position.add(new THREE.Vector3(this.playerSpeed * this.v * Math.sin(this.angle), 0, this.playerSpeed * this.v * Math.cos(this.angle)));
        this.collisionBox = new THREE.Box3().setFromPoints([
            new THREE.Vector3(this.object!.position.x - 40, this.object!.position.y - 1, this.object!.position.z - 40),
            new THREE.Vector3(this.object!.position.x + 40, this.object!.position.y + 1, this.object!.position.z + 40),
        ]);
        
        if (this.v == 0) this.crossFade(this.currentState, 'Idle', 0.1);
        else if (this.playerSpeed == 2) this.crossFade(this.currentState, 'Walking', 0.1);
        else this.crossFade(this.currentState, 'Running', 0.1);

        if (keyPressed['w']) {
            this.v = 1;
        } else {
            this.v = 0;
        }
        if (keyPressed['a']) {
            this.angle += 3 * Math.PI / 180;
        }
        if (keyPressed['d']) {
            this.angle -= 3 * Math.PI / 180;
        }
        if(keyPressed[' ']) {
            this.playerSpeed = 6;
        } else {
            this.playerSpeed = 2;
        }
    }
}

export class Victim extends Character {
    constructor(scene: THREE.Scene) {
        super();
        this.loadObjectFBX(scene, './assets/victimIdle.fbx');
        this.loadAnimationFBX('Idle', './assets/victimIdle.fbx');
        this.setInitState('Idle');
    }
}