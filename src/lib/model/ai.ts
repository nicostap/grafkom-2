import * as THREE from "three";
import { acceleratedRaycast } from "three-mesh-bvh";

THREE.Mesh.prototype.raycast = acceleratedRaycast;

export class AI {
    score = 0;
    v = 0;
    angle = 0;
    playerSpeed = 2;
    position = new THREE.Vector3(0, 0, 0);
    collisionSphere: THREE.Sphere | undefined;
    sight: any = new THREE.Raycaster();
    sightLeft: any = new THREE.Raycaster();
    sightRight: any = new THREE.Raycaster();
    
    constructor() {
        this.sight.far = 800;
        this.sightLeft.far = 800;
        this.sightRight.far = 800;

        this.sight.firstHitOnly = true;
        this.sightLeft.firstHitOnly = true;
        this.sightRight.firstHitOnly = true;
    }

    reset(x: number, y: number, z: number, angle: number) {
        this.position.set(x, y, z);
        this.playerSpeed = 2;
        this.angle = angle;
        this.v = 0;
        this.score = 0;
    }

    getDistanceToWall(walls: THREE.Object3D[]) {
        this.sight.set(
            this.position,
            new THREE.Vector3(Math.sin(this.angle), 0, Math.cos(this.angle)).normalize()
        );
        this.sightLeft.set(
            this.position,
            new THREE.Vector3(Math.sin(this.angle - Math.PI / 6), 0, Math.cos(this.angle - Math.PI / 6)).normalize()
        );
        this.sightRight.set(
            this.position,
            new THREE.Vector3(Math.sin(this.angle + Math.PI / 6), 0, Math.cos(this.angle + Math.PI / 6)).normalize()
        );

        let results = [];
        let intersects = this.sightLeft.intersectObjects(walls, false);
        if(intersects.length == 0) results.push(this.sightLeft.far);
        else results.push(intersects[0].distance);
        intersects = this.sight.intersectObjects(walls, false);
        if(intersects.length == 0) results.push(this.sight.far);
        else results.push(intersects[0].distance);
        intersects = this.sightRight.intersectObjects(walls, false);
        if(intersects.length == 0) results.push(this.sightRight.far);
        else results.push(intersects[0].distance);
        return results;
    }

    run(dt: number, wallCollisionBoxes: THREE.Box3[], keyPressed: { [key: string]: boolean }) {
        let prev_position = this.position.clone();
        this.position = this.position.add(new THREE.Vector3((dt / 0.016) * this.playerSpeed * this.v * Math.sin(this.angle), 0, (dt / 0.016) * this.playerSpeed * this.v * Math.cos(this.angle)));
        this.collisionSphere = new THREE.Sphere(this.position, 40);

        for (let wallCollisionBox of wallCollisionBoxes) {
            if (this.collisionSphere?.intersectsBox(wallCollisionBox)) {
                this.position.x = prev_position.x;
                this.position.z = prev_position.z;
            }
        }

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
        if(keyPressed[' ']) {
            this.playerSpeed = 6;
        } else {
            this.playerSpeed = 2;
        }
    }
}
