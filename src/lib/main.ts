import * as THREE from 'three';
import { Clown } from './model/character';
import { Input } from './input';
import { NEAT, activation, crossover, mutate } from './neural/NEAT';
import { AI } from './model/ai';

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
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(500, 500, 500, 50, 50),
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

    // Helper
    var helper = new THREE.CameraHelper(pLight.shadow.camera);
    scene.add(helper);

    // Neural
    let config = {
        model: [
            { nodeCount: 6, type: "input" },
            { nodeCount: 16, type: "output", activationfunc: activation.RELU }
        ],
        mutationRate: 0.05,
        crossoverMethod: crossover.RANDOM,
        mutationMethod: mutate.RANDOM,
        populationSize: 5
    };
    let neat = new NEAT(config);

    // Neural AI
    let monsters: AI[] = [];
    let samePosition: number[] = [];
    for(let i = 0; i < neat.populationSize; i++) {
        monsters.push(new AI());
        samePosition.push(0);
    }

    // Interval of generations
    let isFirstGenDone = false;
    const interval = setInterval(() => {
        for(let i = 0; i < neat.populationSize; i++) {
            monsters[i].score = 1 / (monsters[i].position.distanceTo(target) + samePosition[i] * 100);
            neat.setFitness(monsters[i].score, i);
            monsters[i].reset(
                clown.object!.position.x,
                clown.object!.position.y,
                clown.object!.position.z,
                clown.angle
            );
            samePosition[i] = 0;
        }
        neat.doGen();
        isFirstGenDone = true;
    }, 10000);

    // Animation
    let target = new THREE.Vector3(3000, 0, 3000);
    let isTerminated = false;
    let cameraAngle = 0;
    {
        var time_prev = 0;
        function animate(time: number) {
            // AI
            for(let i = 0; i < neat.populationSize; i++) {
                neat.setInputs([
                    NEAT.mapNumber(monsters[i].position.x, -250, 3250),
                    NEAT.mapNumber(monsters[i].position.z, -250, 3250),
                    NEAT.mapNumber(monsters[i].angle % 2 * Math.PI, 0, 2 * Math.PI),
                    NEAT.mapNumber(target.x, -250, 3250),
                    NEAT.mapNumber(target.z, -250, 3250),
                    NEAT.mapNumber(monsters[i].getDistanceToWall(walls), 0, monsters[i].sight.far),
                ], i);
            }
            neat.feedForward();
            const decisions = neat.getDecisions();
            for(let i = 0; i < neat.populationSize; i++) {
                const input = decisions[i].toString(2).padStart(4, '0');
                const inputPressed = {
                    'w': input[0] == '1',
                    'a': input[1] == '1',
                    'd': input[2] == '1',
                    ' ': input[3] == '1',
                }
                const prev_position = monsters[i].position.clone();
                monsters[i].run(wallCollisionBoxes, inputPressed);
                if(monsters[i].position.equals(prev_position)) samePosition[i]++;
                else samePosition[i] = 0;
            }

            // Time
            var dt = time - time_prev;
            dt *= 0.001;
            time_prev = time;

            // Clown
            if (clown.object) {
                if(isFirstGenDone) {
                    const bestCreature = neat.bestCreature();
                    bestCreature.setInputs([
                        NEAT.mapNumber(clown.object.position.x, -250, 3250),
                        NEAT.mapNumber(clown.object.position.z, -250, 3250),
                        NEAT.mapNumber(clown.angle % 2 * Math.PI, 0, 2 * Math.PI),
                        NEAT.mapNumber(target.x, -250, 3250),
                        NEAT.mapNumber(target.z, -250, 3250),
                        NEAT.mapNumber(clown.getDistanceToWall(walls), 0, clown.sight.far),
                    ]);
                    bestCreature.feedForward();
                    const input = bestCreature.decision().toString(2).padStart(4, '0');
                    const inputPressed = {
                        'w': input[0] == '1',
                        'a': input[1] == '1',
                        'd': input[2] == '1',
                        ' ': input[3] == '1',
                    }
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

            if(input.keyPressed['s']) console.log(neat.export());

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