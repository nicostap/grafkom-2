import * as THREE from 'three';
import { Clown, Victim } from './model/character';
import { Input } from './input';

export function renderMain() {
    // Initial Set Up
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Clown
    let clown = new Clown(scene);
    // Victim
    let victim = new Victim(scene);

    // Light
    const dirLight = new THREE.DirectionalLight(0xffffff, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.position.set(0, 0, 0);
    dirLight.shadow.camera.top = 200;
    dirLight.shadow.camera.bottom = -200;
    dirLight.shadow.camera.left = -200;
    dirLight.shadow.camera.right = 200;
    dirLight.shadow.bias = -0.002;
    scene.add(dirLight);
    scene.add(dirLight.target);

    // Floor
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        new THREE.MeshPhongMaterial({ color: 0x999999 })
    );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Input
    const input = new Input();

    // Helper
    var helper = new THREE.CameraHelper( dirLight.shadow.camera );
    scene.add(helper);

    // Animation
    let isTerminated = false;
    let cameraAngle = 0;
    {
        var time_prev = 0;
        function animate(time: number) {
            // Time
            var dt = time - time_prev;
            dt *= 0.001;
            time_prev = time;

            // Clown
            clown.run(dt, input.keyPressed);
            if(clown.object) {
                dirLight.target.position.set(clown.object.position.x, 0, clown.object.position.z);
                dirLight.position.set(clown.object.position.x, 400, clown.object.position.z);

                if(input.keyPressed['q']) cameraAngle -= 3 * Math.PI / 180;
                if(input.keyPressed['e']) cameraAngle += 3 * Math.PI / 180;
                camera.position.set(
                    clown.object.position.x - 200 * Math.sin(cameraAngle),
                    200,
                    clown.object.position.z - 200 * Math.cos(cameraAngle)
                );
                camera.lookAt(clown.object.position.x, 150, clown.object.position.z);
            }
            // Victim
            victim.mixer?.update(dt);

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