import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import "./App.css";
import { Bar2 } from "./components/Bar2";
import { Maze } from "./components/Maze";
import { SpectatorControls } from "./components/SpectatorControls";
import { City } from "./components/City";
import { Victim } from "./components/Victim";
import { Clown } from "./components/Clown";
import * as THREE from 'three';
import {
    CubeTextureLoader
  } from "three";

function SkyBox() {
    const { scene } = useThree();
    const loader = new CubeTextureLoader();
    // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
    const texture = loader.load([
      "/sky/1.jpg",
      "/sky/2.jpg",
      "/sky/3.jpg",
      "/sky/1.jpg",
      "/sky/2.jpg",
      "/sky/3gi.jpg"
    ]);
  
    // Set the scene background property to the resulting texture.
    scene.background = texture;
    return null;
  }

  function CameraMovement() {
    const { camera } = useThree();
    const startTime = useRef(0);
    const duration1 = 10000; // Duration in milliseconds for first cutscene
    const duration2 = 10000; // Duration in milliseconds for second cutscene
    const startPosition1 = new THREE.Vector3(10000 - 200, 250, 300);
    const endPosition1 = new THREE.Vector3(10000 + 100, 250, 300);
    const startRotation1 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, -Math.PI / 5, 0)
    );
    const endRotation1 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, Math.PI / 5, 0)
    );
    const startPosition2 = new THREE.Vector3(10000, 180, -250);
    const endPosition2 = new THREE.Vector3(10000, 180, -250);
    const startRotation2 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, Math.PI / 2, 0)
    );
    const endRotation2 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, Math.PI / 1.7, 0)
    );
    const [cutscene, setCutscene] = useState(0);

    useEffect(() => {
        camera.position.copy(startPosition1);
        camera.quaternion.copy(startRotation1);
        startTime.current = performance.now();
    }, [camera]);

    useFrame(() => {
        if (cutscene === 0) {
            const elapsed = performance.now() - startTime.current;
            const progress = Math.min(elapsed / duration1, 1);

            camera.position.lerpVectors(startPosition1, endPosition1, progress);
            camera.quaternion.slerpQuaternions(
                startRotation1,
                endRotation1,
                progress
            );

            if (progress === 1) {
                startTime.current = performance.now(); // Reset the startTime for the next cutscene
                setCutscene(1);
            }
        }

        if (cutscene === 1) {
            const elapsed = performance.now() - startTime.current;
            const progress = Math.min(elapsed / duration2, 1);

            camera.position.lerpVectors(startPosition2, endPosition2, progress);
            camera.quaternion.slerpQuaternions(
                startRotation2,
                endRotation2,
                progress
            );

            if (progress === 1) {
                setCutscene(2); // End of cutscenes
            }
        }
        else if (cutscene === 2) {
            // Teleport to the new position
            camera.position.set(-10000, 100, 0);
            camera.rotation.set(0, 0, 0);
            setCutscene(3); // Prevent this block from running again
        }
    });

    return null;
}

function App() {
    return (
        <KeyboardControls
            map={[
                { name: "forward", keys: ["ArrowUp", "w"] },
                { name: "backward", keys: ["ArrowDown", "s"] },
                { name: "left", keys: ["ArrowLeft", "a"] },
                { name: "right", keys: ["ArrowRight", "d"] },
                { name: "sprint", keys: ["Shift"] },
            ]}
        >
            <Canvas shadows>
                <Perf />
                <PerspectiveCamera
                    position={[10000 - 200, 250, 300]}
                    rotation={[0, -Math.PI / 4, 0]}
                    fov={75}
                    near={0.1}
                    far={100000}
                    makeDefault
                />
                <CameraMovement />
                <SpectatorControls />
                <ambientLight intensity={Math.PI / 8} />
                <Maze receiveShadow position={[0, 0, 0]} />
                {/* Scene 1 - Minum-minum */}
                <Bar2
                    receiveShadow
                    position={[10000, 0, 0]}
                    scale={[60, 60, 60]}
                />
                {/* Scene 2 - Mabok-mabok */}
                <SkyBox />
                <City
                    receiveShadow
                    castShadow
                    position={[-10000, 100, 1000]}
                    scale={[600, 600, 600]}
                    rotation={[0, Math.PI / 2, 0]}
                />
                <Victim
                    position={[0, 10, -1000]}
                    scale={[100, 100, 100]}
                    receiveShadow
                    castShadow
                />
            </Canvas>
        </KeyboardControls>
    );
}

export default App;
