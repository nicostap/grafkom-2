import * as THREE from 'three';
import { Clown } from './model/character';
import { Input } from './input';
import { NEAT, activation, crossover, mutate } from './neural/NEAT';
import { AI } from './model/ai';
import { MeshBVH } from 'three-mesh-bvh';
import { acceleratedRaycast } from "three-mesh-bvh";
import type Creature from './neural/Creature';
import data from './modelNeural/model';

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

    // Neural
    let neat: NEAT;
    try {
        let config = {
            model: [
                { nodeCount: 8, type: "input" },
                { nodeCount: 16, type: "output", activationfunc: activation.SIGMOID }
            ],
            mutationRate: 0.15,
            crossoverMethod: crossover.SLICE,
            mutationMethod: mutate.RANDOM,
            populationSize: 1
        };
        neat = new NEAT(config);
        neat.import(data);
        console.log(neat.populationSize);
    } catch (e) {
        console.log(e);
        console.log("No imported model found");
        let config = {
            model: [
                { nodeCount: 8, type: "input" },
                { nodeCount: 16, type: "output", activationfunc: activation.RELU }
            ],
            mutationRate: 0.05,
            crossoverMethod: crossover.SLICE,
            mutationMethod: mutate.RANDOM,
            populationSize: 250
        };
        neat = new NEAT(config);
    }

    // Neural Set Up
    let monsters: AI[] = [];
    let samePosition: number[] = [];
    for (let i = 0; i < neat.populationSize; i++) {
        monsters.push(new AI(scene));
        samePosition.push(1);
    }

    // Neural
    let target = new THREE.Vector3(3000, 0, 3000);
    let origin = new THREE.Vector3(0, 0, 0);
    let originAngle = 0;
    let bestCreature: Creature;
    let isFirstGenDone = false;
    const interval = setInterval(() => {
        let aliveCount = 0;
        for (let i = 0; i < neat.populationSize; i++) {
            if (monsters[i].isAlive) aliveCount++;
            else monsters[i].score *= 0.5;
            neat.setFitness(monsters[i].score, i);
            monsters[i].reset(...origin.toArray(), originAngle);
            clown.object?.position.set(...origin.toArray());
            clown.angle = originAngle;
        }
        neat.doGen();
        bestCreature = neat.bestCreature;
        console.log(bestCreature.score);
        console.log(aliveCount);
        isFirstGenDone = true;
    }, 20000);

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
            for (let i = 0; i < neat.populationSize; i++) {
                if (!monsters[i].isAlive) continue;
                let sightResult = monsters[i].getDistanceToWall(walls);
                neat.setInputs([
                    NEAT.mapNumber(monsters[i].position.x, -250, 3250),
                    NEAT.mapNumber(monsters[i].position.z, -250, 3250),
                    NEAT.mapNumber(monsters[i].angle % (2 * Math.PI), 0, 2 * Math.PI),
                    NEAT.mapNumber(target.x, -250, 3250),
                    NEAT.mapNumber(target.z, -250, 3250),
                    NEAT.mapNumber(sightResult[0], 30, monsters[i].sightLeft.far),
                    NEAT.mapNumber(sightResult[1], 30, monsters[i].sight.far),
                    NEAT.mapNumber(sightResult[2], 30, monsters[i].sightRight.far),
                ], i);
            }
            neat.feedForward();
            const decisions = neat.getDecisions();
            for (let i = 0; i < neat.populationSize; i++) {
                if (!monsters[i].isAlive) continue;
                const prev_position = monsters[i].position.clone();
                const input = decisions[i].toString(2).padStart(4, '0');
                const inputPressed = {
                    'w': input[0] == '1',
                    'a': input[1] == '1',
                    'd': input[2] == '1',
                    ' ': input[3] == '1',
                }
                monsters[i].run(dt, wallCollisionBoxes, inputPressed);
                if(prev_position.equals(monsters[i].position)) samePosition[i] += 5;
                else samePosition[i] = 1;
                monsters[i].score += 20 / (samePosition[i] * monsters[i].position.distanceTo(target));
            }
            // Clown
            if (clown.object) {
                if (isFirstGenDone) {
                    let sightResult = clown.getDistanceToWall(walls);
                    bestCreature.setInputs([
                        NEAT.mapNumber(clown.object.position.x, -250, 3250),
                        NEAT.mapNumber(clown.object.position.z, -250, 3250),
                        NEAT.mapNumber(clown.angle % (2 * Math.PI), 0, 2 * Math.PI),
                        NEAT.mapNumber(target.x, -250, 3250),
                        NEAT.mapNumber(target.z, -250, 3250),
                        NEAT.mapNumber(sightResult[0], 30, clown.sightLeft.far),
                        NEAT.mapNumber(sightResult[1], 30, clown.sight.far),
                        NEAT.mapNumber(sightResult[2], 30, clown.sightRight.far),
                    ]);
                    bestCreature.feedForward();
                    const input = bestCreature.decision().toString(2).padStart(4, '0');
                    const inputPressed = {
                        'w': input[0] == '1',
                        'a': input[1] == '1',
                        'd': input[2] == '1',
                        ' ': input[3] == '1',
                    }
                    arrow.position.set(clown.sight.ray.origin.x, clown.sight.ray.origin.y, clown.sight.ray.origin.z);
                    arrowLeft.position.set(clown.sight.ray.origin.x, clown.sight.ray.origin.y, clown.sight.ray.origin.z);
                    arrowRight.position.set(clown.sight.ray.origin.x, clown.sight.ray.origin.y, clown.sight.ray.origin.z);
                    arrow.setDirection(clown.sight.ray.direction);
                    arrowLeft.setDirection(clown.sightLeft.ray.direction);
                    arrowRight.setDirection(clown.sightRight.ray.direction);
                    clown.run(dt, wallCollisionBoxes, inputPressed);
                } else {
                    // console.log(clown.getDistanceToWall(walls));
                    // arrow.position.set(clown.sight.ray.origin.x, clown.sight.ray.origin.y, clown.sight.ray.origin.z);
                    // arrowLeft.position.set(clown.sight.ray.origin.x, clown.sight.ray.origin.y, clown.sight.ray.origin.z);
                    // arrowRight.position.set(clown.sight.ray.origin.x, clown.sight.ray.origin.y, clown.sight.ray.origin.z);
                    // arrow.setDirection(clown.sight.ray.direction);
                    // arrowLeft.setDirection(clown.sightLeft.ray.direction);
                    // arrowRight.setDirection(clown.sightRight.ray.direction);
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

            if (input.keyPressed['s']) console.log(neat.export());

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