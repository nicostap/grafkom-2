import * as THREE from 'three';
import { Clown } from './model/character';
import { Input } from './input';
import { AI } from './model/ai';
import { MeshBVH } from 'three-mesh-bvh';
import { acceleratedRaycast } from "three-mesh-bvh";
import Population from './neural/population';

THREE.Mesh.prototype.raycast = acceleratedRaycast;

class BoundedGeometry extends THREE.BufferGeometry {
    boundsTree: any;
    constructor(bg: THREE.BufferGeometry) {
        super();
        this.copy(bg);
        this.boundsTree = new MeshBVH(this as THREE.BufferGeometry);
    };
}

export function renderMain() {
    // Initial Set Up
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

    // Clown
    let clown = new Clown(scene);

    // Map
    let map = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('./assets/wallpaper/floor.jpg');
    const displacement = textureLoader.load('./assets/cobblestone/floor_displace.jpg');
    const wallpaperTexture = textureLoader.load('./assets/wallpaper/texture.jpg');
    const wallpaperNormalTexture = textureLoader.load('./assets/wallpaper/texture.png');
    const wallCollisionBoxes: THREE.Box3[] = [];
    const walls: THREE.Object3D[] = [];
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] == 0) {
                // Wall
                const boundedWallGeometry = new BoundedGeometry(new THREE.BoxGeometry(500, 500, 500, 50, 50));
                const mesh = new THREE.Mesh(
                    boundedWallGeometry,
                    new THREE.MeshPhongMaterial({ color: 0x999999, map: wallpaperTexture, normalMap: wallpaperNormalTexture })
                );
                mesh.position.set(i * 500 - 500, 250, j * 500 - 500);
                wallCollisionBoxes.push(new THREE.Box3().setFromObject(mesh));
                walls.push(mesh);
                scene.add(mesh);
            }
            else if (map[i][j] == 1) {
                // Floor
                let mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(500, 500, 5, 5),
                    new THREE.MeshPhongMaterial({ color: 0x999999, map: texture, displacementMap: displacement })
                );
                mesh.position.set(i * 500 - 500, 0, j * 500 - 500);
                mesh.rotation.x = -Math.PI / 2;
                mesh.receiveShadow = true;
                scene.add(mesh);
                // Ceiling
                mesh = new THREE.Mesh(
                    new THREE.PlaneGeometry(500, 500, 5, 5),
                    new THREE.MeshPhongMaterial({ color: 0x999999, map: texture, displacementMap: displacement })
                );
                mesh.position.set(i * 500 - 500, 500, j * 500 - 500);
                mesh.rotation.x = Math.PI / 2;
                scene.add(mesh);
            }
        }
    }

    // Light
    const pLight = new THREE.PointLight(0xffffff, 100000);
    pLight.castShadow = true;
    // Set up shadow properties for the light
    pLight.shadow.mapSize.width = 1024;
    pLight.shadow.mapSize.height = 1024;
    pLight.shadow.camera.near = 0.5;
    pLight.shadow.camera.far = 450;
    scene.add(pLight);

    // Input
    const input = new Input();

    // Neural v2
    const population = new Population(100);

    // Neural Set Up
    let monsters: AI[] = [];
    let samePosition: number[] = [];
    for (let i = 0; i < population.size; i++) {
        monsters.push(new AI(scene));
        samePosition.push(1);
    }

    // Evolution
    const targets = [
        new THREE.Vector3(3000, 0, 3000),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(1500, 0, 3000),
        new THREE.Vector3(1500, 0, 2000),
        new THREE.Vector3(2000, 0, 2500),
        new THREE.Vector3(1000, 0, 1000),
        new THREE.Vector3(3000, 0, 1500),
    ];
    let target = targets[0];
    const interval = setInterval(() => {
        for (let i = 0; i < population.size; i++) {
            monsters[i].reset(
                clown.object!.position.x,
                clown.object!.position.y,
                clown.object!.position.z,
                clown.angle
            );
        }
        population.naturalSelection();
        if(population.generation % 10 == 9) target = targets[Math.floor(Math.random() * targets.length)];
    }, 15000);

    // Animation
    let isTerminated = false;
    let cameraAngle = 0;
    const arrow = new THREE.ArrowHelper(clown.sight.ray.direction, clown.sight.ray.origin, 800, 0xff0000);
    const arrowLeft = new THREE.ArrowHelper(clown.sightLeft.ray.direction, clown.sight.ray.origin, 800, 0xff0000);
    const arrowRight = new THREE.ArrowHelper(clown.sightRight.ray.direction, clown.sight.ray.origin, 800, 0xff0000);
    scene.add(arrow);
    scene.add(arrowLeft);
    scene.add(arrowRight);
    {
        var time_prev = 0;
        function animate(time: number) {
            // Time
            var dt = time - time_prev;
            dt *= 0.001;
            time_prev = time;

            // AI
            let inputs = [];
            for (let i = 0; i < population.size; i++) {
                let sightResult = monsters[i].getDistanceToWall(walls);
                inputs.push([
                    Population.mapNumber(monsters[i].position.x, -250, 3250),
                    Population.mapNumber(monsters[i].position.z, -250, 3250),
                    Population.mapNumber(monsters[i].angle % (2 * Math.PI), 0, 2 * Math.PI),
                    Population.mapNumber(target.x, -250, 3250),
                    Population.mapNumber(target.z, -250, 3250),
                    Population.mapNumber(sightResult[0], 30, monsters[i].sightLeft.far),
                    Population.mapNumber(sightResult[1], 30, monsters[i].sight.far),
                    Population.mapNumber(sightResult[2], 30, monsters[i].sightRight.far),
                ]);
            }
            const decisions: any = population.update(inputs);
            for (let i = 0; i < population.size; i++) {
                if(decisions[i].length == 0) continue;
                const prev_position = monsters[i].position.clone();
                const inputPressed = {
                    'w': decisions[i][0] >= 0,
                    'a': decisions[i][1] >= 0,
                    'd': decisions[i][2] >= 0,
                    ' ': decisions[i][3] >= 0,
                }
                monsters[i].run(dt, wallCollisionBoxes, inputPressed);
                if(prev_position.equals(monsters[i].position)) samePosition[i] += 5;
                else samePosition[i] = 1;
                population.addScore(20 / (1 + samePosition[i] * monsters[i].position.distanceTo(target)), monsters[i].isAlive, i);
            }

            // Clown
            if (clown.object) {
                if (population.generation > 0) {
                    let sightResult = clown.getDistanceToWall(walls);
                    population.bestPlayer!.setInput([
                        Population.mapNumber(clown.object.position.x, -250, 3250),
                        Population.mapNumber(clown.object.position.z, -250, 3250),
                        Population.mapNumber(clown.angle % (2 * Math.PI), 0, 2 * Math.PI),
                        Population.mapNumber(target.x, -250, 3250),
                        Population.mapNumber(target.z, -250, 3250),
                        Population.mapNumber(sightResult[0], 30, clown.sightLeft.far),
                        Population.mapNumber(sightResult[1], 30, clown.sight.far),
                        Population.mapNumber(sightResult[2], 30, clown.sightRight.far),
                    ]);
                    population.bestPlayer!.feedForward();
                    const decision = population.bestPlayer!.decisions;
                    const inputPressed = {
                        'w': decision[0] >= 0,
                        'a': decision[1] >= 0,
                        'd': decision[2] >= 0,
                        ' ': decision[3] >= 0,
                    }
                    arrow.position.set(clown.sight.ray.origin.x, clown.sight.ray.origin.y, clown.sight.ray.origin.z);
                    arrowLeft.position.set(clown.sight.ray.origin.x, clown.sight.ray.origin.y, clown.sight.ray.origin.z);
                    arrowRight.position.set(clown.sight.ray.origin.x, clown.sight.ray.origin.y, clown.sight.ray.origin.z);
                    arrow.setDirection(clown.sight.ray.direction);
                    arrowLeft.setDirection(clown.sightLeft.ray.direction);
                    arrowRight.setDirection(clown.sightRight.ray.direction);
                    clown.run(dt, wallCollisionBoxes, inputPressed);
                } else {
                    clown.run(dt, wallCollisionBoxes, input.keyPressed);
                }
                pLight.position.set(clown.object.position.x, 400, clown.object.position.z);
                if (input.keyPressed['q']) cameraAngle += 3 * Math.PI / 180;
                if (input.keyPressed['e']) cameraAngle -= 3 * Math.PI / 180;
                camera.position.set(
                    clown.object.position.x - 200 * Math.sin(cameraAngle),
                    200,
                    clown.object.position.z - 200 * Math.cos(cameraAngle)
                );
                camera.lookAt(clown.object.position.x, 150, clown.object.position.z);
            }

            // Drawing scene   
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }

    return () => {
        isTerminated = true;
        clearInterval(interval);
        input.unhookEvents();
    };
}