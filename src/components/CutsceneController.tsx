import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "./AppContext";

export function CustsceneController() {
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

    const { appState, setAppState } = useAppContext();

    useEffect(() => {
        let ongoingCutscene = true;
        if (cutscene === 3) {
            ongoingCutscene = false;
        }

        setAppState({ ...appState, currentScene: cutscene, ongoingCutscene: ongoingCutscene })

        return () => {
            setAppState({ ...appState, ongoingCutscene: false });
        };
    }, [cutscene, appState, setAppState]);

    useEffect(() => {
        camera.position.copy(startPosition1);
        camera.quaternion.copy(startRotation1);
        startTime.current = performance.now();
    }, [camera]);

    useFrame(() => {
        if(!appState.ongoingCutscene) return;
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
        } else if (cutscene === 2) {
            // Teleport to the new position
            camera.position.set(-10000, 100, 0);
            camera.rotation.set(0, 0, 0);
            setCutscene(3); // Prevent this block from running again
        } else if (cutscene === 3) {
            camera.position.set(0, 150, 0);
            camera.rotation.set(0, 0, 0);
        }
    });

    return null;
}
