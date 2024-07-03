import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
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
      "/sky/4.jpg",
      "/sky/5.jpg",
      "/sky/6.jpg"
    ]);
  
    // Set the scene background property to the resulting texture.
    scene.background = texture;
    return null;
  }

function CameraMovement() {
    const { camera } = useThree();
    var startTime = 0;
    const duration = 10000; // Duration in milliseconds
    const startPosition = new THREE.Vector3(10000 - 200, 250, 300);
    const endPosition = new THREE.Vector3(10000 + 100, 250, 300); 
    const startRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -Math.PI / 5, 0));
    const endRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 5, 0));
    const [cutscene, finishedCutscene] = useState(false);


    useEffect(() => {
        camera.position.copy(startPosition);
        camera.quaternion.copy(startRotation);
        startTime = performance.now();
      }, [camera]);
    
      useFrame(() => {
        if (startTime) {
          const elapsed = performance.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
    
          camera.position.lerpVectors(startPosition, endPosition, progress);
          camera.quaternion.slerpQuaternions(startRotation, endRotation, progress);
    
          if (progress === 1) {
            startTime = 0; // Stop the animation once the duration is complete
            finishedCutscene(true);
          }
        }
    
        if (cutscene) {
          // Enable Scene 2 here
          camera.position.set(-10000, 100, 0);
          camera.rotation.set(0, 0, 0);
          finishedCutscene(false); // Reset the state to avoid repeated teleportation
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
                    position={[10000-200, 250, 300]}
                    rotation={[0, -Math.PI/4, 0]}
                    fov={75}
                    near={0.1}
                    far={100000}
                    makeDefault
                />
                <CameraMovement />
                <SpectatorControls />

                <ambientLight intensity={Math.PI / 8} />
                <Maze receiveShadow position={[0, 0, 0]} />
                <SkyBox />
                {/* Scene 1 - Minum-minum */}
                <Bar2
                    receiveShadow
                    position={[10000, 0, 0]}
                    scale={[60, 60, 60]}
                />
                {/* Scene 2 - Mabok-mabok */}
                <City
                    receiveShadow
                    position={[-10000, 100, 1000]}
                    scale={[600, 600, 600]}
                    rotation={[0, Math.PI / 2, 0]}
                />
                <Victim
                    position={[0, 10, -1000]}
                    scale={[100, 100, 100]}
                    receiveShadow
                />
                <directionalLight
                    position={[0, 10, -1000]}
                    intensity={Math.PI}
                    castShadow
                    receiveShadow
                    color="#fff"
                />
            </Canvas>
        </KeyboardControls>
    );
}

export default App;
