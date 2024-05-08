import * as THREE from 'three';

export function renderMain() {
    // Initial Set Up
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Animation
    {
        var time_prev = 0;
        function animate(time: number) {
            // Time
            var dt = time - time_prev;
            dt *= 0.1;
            time_prev = time;

            // Drawing scene
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }
}