import * as THREE from "three";
import { acceleratedRaycast } from "three-mesh-bvh";

THREE.Mesh.prototype.raycast = acceleratedRaycast;

export class Agent {
    object: THREE.Mesh;
    v = 0;
    isAlive = true;
    angle = 0;
    playerSpeed = 2;
    position: THREE.Vector3;
    collisionSphere: THREE.Sphere | undefined;
    sight: any = new THREE.Raycaster();
    sightLeft: any = new THREE.Raycaster();
    sightRight: any = new THREE.Raycaster();
    personalBest: number;
    timeBeforePersonalBest = 0;
    time = 0;
    score = 0;

    constructor(scene: THREE.Scene, origin: THREE.Vector3, target: THREE.Vector3) {
        this.position = origin.clone();
        this.personalBest = origin.distanceTo(target);
        this.sight.far = 3250;
        this.sightLeft.far = 3250;
        this.sightRight.far = 3250;

        this.sight.firstHitOnly = true;
        this.sightLeft.firstHitOnly = true;
        this.sightRight.firstHitOnly = true;

        const geo = new THREE.PlaneGeometry(5, 5, 1, 1);
        this.object = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x0000FF }));
        this.object.rotation.x = -Math.PI / 2;
        scene.add(this.object);
    }

    reset(x: number, y: number, z: number, angle: number, target: THREE.Vector3) {
        this.position.set(x, y, z);
        this.playerSpeed = 2;
        this.angle = angle;
        this.v = 0;
        this.isAlive = true;
        (this.object.material as THREE.MeshBasicMaterial).color.setHex(0x0000FF);
        this.personalBest = this.position.distanceTo(target);
        this.timeBeforePersonalBest = 0;
        this.time = 0;
        this.score = 0;
    }

    getDistanceToWall(walls: THREE.Object3D[]) {
        this.sight.set(
            this.position,
            new THREE.Vector3(Math.sin(this.angle), 0, Math.cos(this.angle)).normalize()
        );
        this.sightLeft.set(
            this.position,
            new THREE.Vector3(Math.sin(this.angle - Math.PI / 4), 0, Math.cos(this.angle - Math.PI / 4)).normalize()
        );
        this.sightRight.set(
            this.position,
            new THREE.Vector3(Math.sin(this.angle + Math.PI / 4), 0, Math.cos(this.angle + Math.PI / 4)).normalize()
        );

        let results = [];
        let intersects = this.sightLeft.intersectObjects(walls, false);
        if (intersects.length == 0) results.push(this.sightLeft.far);
        else results.push(intersects[0].distance);
        intersects = this.sight.intersectObjects(walls, false);
        if (intersects.length == 0) results.push(this.sight.far);
        else results.push(intersects[0].distance);
        intersects = this.sightRight.intersectObjects(walls, false);
        if (intersects.length == 0) results.push(this.sightRight.far);
        else results.push(intersects[0].distance);
        return results;
    }

    run(dt: number, wallCollisionBoxes: THREE.Box3[], keyPressed: { [key: string]: boolean }, target: THREE.Vector3) {
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

        this.object.position.set(...this.position.toArray());
        let prev_position = this.position.clone();
        this.position = this.position.add(new THREE.Vector3((dt / 0.016) * this.playerSpeed * this.v * Math.sin(this.angle), 0, (dt / 0.016) * this.playerSpeed * this.v * Math.cos(this.angle)));
        this.collisionSphere = new THREE.Sphere(this.position, 35);

        for (let wallCollisionBox of wallCollisionBoxes) {
            if (this.collisionSphere?.intersectsBox(wallCollisionBox)) {
                this.position.x = prev_position.x;
                this.position.z = prev_position.z;
                this.isAlive = false;
                (this.object.material as THREE.MeshBasicMaterial).color.setHex(0xFF0000);
            }
        }

        this.time += dt;
        if(this.position.distanceTo(target) < this.personalBest) {
            this.personalBest = this.position.distanceTo(target);
            this.timeBeforePersonalBest = 0;
            this.score = 1 / (Math.pow(this.personalBest, 3) + Math.pow(this.time, 1));
        } else this.timeBeforePersonalBest += dt;
        if(this.timeBeforePersonalBest > 7.5) {
            this.isAlive = false;
            (this.object.material as THREE.MeshBasicMaterial).color.setHex(0xFF0000);
        }
    }
}
