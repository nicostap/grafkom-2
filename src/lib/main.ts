import * as THREE from 'three';
import { Clown } from './model/character';
import { Input } from './input';
import { MeshBVH } from 'three-mesh-bvh';
import { acceleratedRaycast } from "three-mesh-bvh";

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

    // Clown
    let origin = new THREE.Vector3(0, 0, 0);
    let clown = new Clown(scene, origin);

    // Animation
    let isTerminated = false;
    let cameraAngle = 0;
    let cameraDistance = 200;
    let defaultCameraDistance = 200;
    let cameraModes = {"FPS": 1, "TPS": 2};
    let cameraMode = cameraModes.TPS;

    window.addEventListener('keydown', (e) => {
        if(e.key.toLowerCase() == 'x') {
            if(clown.object) {
                cameraMode = cameraMode == cameraModes.FPS ? cameraModes.TPS : cameraModes.FPS;
                if(cameraMode == cameraModes.FPS) {
                    clown.object.visible = false;
                }
                else {
                    cameraAngle = clown.angle;
                    clown.object.visible = true;
                }
            }
        }
    });

    {
        var time_prev = 0;
        function animate(time: number) {
            // Time
            var dt = time - time_prev;
            dt *= 0.001;
            time_prev = time;

            // Clown
            if (clown.object) {
                clown.run(dt, wallCollisionBoxes, input.keyPressed);
                pLight.position.set(clown.object.position.x, 400, clown.object.position.z);

                if(cameraMode == cameraModes.TPS) {
                    if (input.keyPressed['q']) cameraAngle += 3 * Math.PI / 180;
                    if (input.keyPressed['e']) cameraAngle -= 3 * Math.PI / 180;

                    // To Prevent Camera Clipping
                    cameraDistance = defaultCameraDistance;
                    let cameraClipped;
                    do {
                        cameraClipped = false;
                        camera.position.set(
                            clown.object.position.x - cameraDistance * Math.sin(cameraAngle),
                            150 + clown.object.position.y + cameraDistance * Math.sin(Math.PI / 9),
                            clown.object.position.z - cameraDistance * Math.cos(cameraAngle)
                        );
                        for(let collisionTarget of wallCollisionBoxes) {
                            if(collisionTarget.containsPoint(camera.position)) cameraClipped = true;
                        }
                        cameraDistance -= 2;
                    } while(cameraClipped);
                    camera.lookAt(clown.object.position.x, 150, clown.object.position.z);
                } else if(cameraMode == cameraModes.FPS) {
                    camera.position.set(
                        clown.object.position.x,
                        185,
                        clown.object.position.z
                    );
                    camera.rotation.set(0, clown.angle + Math.PI, 0);
                }
            }

            // Drawing scene   
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }

    return () => {
        isTerminated = true;
        input.unhookEvents();
    };
}