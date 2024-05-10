import * as THREE from "three";

export class AI {
    score = 0;
    v = 0;
    angle = 0;
    playerSpeed = 2;
    position = new THREE.Vector3(0, 0, 0);
    collisionSphere: THREE.Sphere | undefined;
    sight = new THREE.Raycaster();
    
    constructor() {
        this.sight.far = 800;
    }

    reset(x: number, y: number, z: number, angle: number) {
        this.position.set(x, y, z);
        this.playerSpeed = 2;
        this.angle = angle;
        this.v = 0;
        this.score = 0;
    }

    getDistanceToWall( walls: THREE.Object3D[] ) {
        const intersects = this.sight.intersectObjects(walls);
        if(intersects.length == 0) return this.sight.far;
        return intersects[0].distance;
    }

    run(wallCollisionBoxes: THREE.Box3[], keyPressed: { [key: string]: boolean }) {
        this.sight.set(
            this.position,
            new THREE.Vector3(Math.sin(this.angle), 0, Math.cos(this.angle)).normalize()
        );

        let prev_position = this.position.clone();
        this.position = this.position.add(new THREE.Vector3(this.playerSpeed * this.v * Math.sin(this.angle), 0, this.playerSpeed * this.v * Math.cos(this.angle)));
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
