import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "./AppContext";
import { Victim } from "./Victim";

export function CustsceneController() {
    const { camera } = useThree();
    const startTime = useRef(0);
    const duration1 = 10000; // Duration in milliseconds for first cutscene
    const duration2 = 20000; // Duration in milliseconds for second cutscene
    const duration3 = 20000; // Duration in milliseconds for second cutscene
    const duration4 = 10000; // Duration in milliseconds for second cutscene
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
        new THREE.Euler(0, Math.PI*4/3, 0)
    );
    
    const startPosition3 = new THREE.Vector3(-9200, 250, -1000);
    const endPosition3 = new THREE.Vector3(-9200, 250, -1600);
    const startRotation3 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, Math.PI, 0)
    );
    const endRotation3 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, Math.PI, Math.PI)
    );

    const startPosition4 = new THREE.Vector3(-9200, 250, -1600);
    const endPosition4 = new THREE.Vector3(-9200, 10000, -1600);
    const startRotation4 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, Math.PI, Math.PI)
    );
    const endRotation4 = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.PI/3, Math.PI, 0)
    );


    
    const [cutscene, setCutscene] = useState(0);

    const [appState, setAppState] = useAppContext();

    useEffect(() => {
        let ongoingCutscene = true;
        if (cutscene === 4) {
            ongoingCutscene = false;
        }

        setAppState({
            ...appState,
            currentScene: cutscene,
            ongoingCutscene: ongoingCutscene,
        });

        return () => {
            setAppState({ ...appState, ongoingCutscene: false });
        };
    }, [cutscene]);

    useEffect(() => {
        camera.position.copy(startPosition1);
        camera.quaternion.copy(startRotation1);
        startTime.current = performance.now();
    }, [camera]);

    useFrame(() => {
        if (!appState.ongoingCutscene) return;
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
                startTime.current = performance.now();
                setCutscene(2); 
            }
        } else if (cutscene === 2) {
            const elapsed = performance.now() - startTime.current;
            const progress = Math.min(elapsed / duration3, 1);

            camera.position.lerpVectors(startPosition3, endPosition3, progress);
            camera.quaternion.slerpQuaternions(
                startRotation3,
                endRotation3,
                progress
            );
            // Teleport to the new position
            // camera.position.set(-9200, 200, 1000);
            // camera.rotation.set(0, 0, 0);
            if (progress === 1) {
                startTime.current = performance.now();
                setCutscene(3); // End of cutscenes
            } // Prevent this block from running again
        }
        else if (cutscene === 3) {
            const elapsed = performance.now() - startTime.current;
            const progress = Math.min(elapsed / duration4, 1);

            camera.position.lerpVectors(startPosition4, endPosition4, progress);
            camera.quaternion.slerpQuaternions(
                startRotation4,
                endRotation4,
                progress
            );
            // Teleport to the new position
            // camera.position.set(-9200, 200, 1000);
            // camera.rotation.set(0, 0, 0);
            if (progress === 1) {
                setCutscene(4); // End of cutscenes
            } // Prevent this block from running again
        }
        //     } else if (cutscene === 3) {
        //         // camera.position.set(0, 150, 0);
        //         // camera.rotation.set(0, 0, 0);
        //     }
    });

    return null;
}
