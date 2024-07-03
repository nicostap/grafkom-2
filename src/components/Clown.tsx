import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";

interface CharacterProps extends GroupProps {
    url: string;
    targetPosition: [number, number, number];
}

export const Clown: React.FC<CharacterProps> = (props) => {
    const group = useRef<THREE.Group>();
    const { nodes, materials, animations } = useGLTF(props.url);
    const { actions, mixer } = useAnimations(animations, group);

    const [currentState, setCurrentState] = useState<string>("");

    const { raycaster } = useThree();

    const decision = {
        left: false,
        right: false,
        forward: true,
    }
    let v = 0;

    useEffect(() => {
        if (mixer && actions) {
            actions["idle"]!.play();
            setCurrentState("Idle");
        }
    }, [mixer, actions]);

    const setAnimation = (state: string) => {
        if (actions && actions[state]) {
            actions[currentState]!.fadeOut(0.5);
            actions[state]!.reset().fadeIn(0.5).play();
            setCurrentState(state);
        }
    };

    useFrame((state, dt) => {
        if(!group.current) return;
        raycaster.set(
            group.current.position,
            new THREE.Vector3(
                Math.sin(group.current.rotation.y + Math.PI / 4),
                0,
                Math.cos(group.current.rotation.y + Math.PI / 4)
            ).normalize()
        );
        const leftSight = raycaster.intersectObjects(state.scene.children)[0]
            .distance;
        raycaster.set(
            new THREE.Vector3(...group.current.position),
            new THREE.Vector3(
                Math.sin(group.current.rotation.y),
                0,
                Math.cos(group.current.rotation.y)
            ).normalize()
        );
        const middleSight = raycaster.intersectObjects(state.scene.children)[0]
            .distance;
        raycaster.set(
            new THREE.Vector3(...group.current.position),
            new THREE.Vector3(
                Math.sin(group.current.rotation.y - Math.PI / 4),
                0,
                Math.cos(group.current.rotation.y - Math.PI / 4)
            ).normalize()
        );
        const rightSight = raycaster.intersectObjects(state.scene.children)[0]
            .distance;

        // Decision Heuristics
        if(middleSight < 40) decision.forward = false;
        if(distanceTo(...props.targetPosition, ...group.current.position.toArray()) < 50) decision.forward = false;
        if (leftSight <= 240 && leftSight < rightSight) {
            decision.right = true;
        } else if (rightSight <= 240 && leftSight > rightSight) {
            decision.left = true;
        } else if (middleSight <= 240) {
            if (leftSight < rightSight) decision.right = true;
            else decision.left = true;
        } else {
            const distVector = new THREE.Vector3(
                props.targetPosition[0] - group.current.position.x,
                props.targetPosition[1] - group.current.position.y,
                props.targetPosition[2] - group.current.position.z
            );
            const distAngle = vectorAngle(distVector.z, distVector.x);
            const subAngle =
                ((distAngle % 360) -
                    (radToDeg(group.current.rotation.y) % 360) +
                    360) %
                360;
            if (subAngle <= 177) {
                decision.left = true;
            } else if (subAngle >= 183) {
                decision.right = true;
            }
        }

        if (decision.forward) {
            v = 4;
        }
        if (decision.left) {
            group.current.rotation.y += (dt / 0.016) * 2 * Math.PI / 180;
        }
        if (decision.right) {
            group.current.rotation.y  -= (dt / 0.016) * 2 * Math.PI / 180;
        }

        const prev_position = group.current.position.clone();
        group.current.position.add(new THREE.Vector3((dt / 0.016) * v * Math.sin(group.current.rotation.y ), 0, (dt / 0.016) * v * Math.cos(group.current.rotation.y )));
        if(middleSight < 40) group.current.position.set(...prev_position.toArray());
    });

    return <group {...props}></group>;
};

function radToDeg(rad: number) {
    return rad * (180 / Math.PI);
}

function vectorAngle(x: number, y: number) {
    if (x == 0) return y > 0 ? 90 : y == 0 ? 0 : 270;
    else if (y == 0) return x >= 0 ? 0 : 180;
    let ret = radToDeg(Math.atan(y / x));
    if (x < 0 && y < 0) ret = 180 + ret;
    else if (x < 0) ret = 180 + ret;
    else if (y < 0) ret = 270 + (90 + ret);
    return ret;
}

function distanceTo(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    
    return distance;
}