import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";

type GLTFResult = GLTF & {
    nodes: {
        WhiteClown: THREE.SkinnedMesh;
        mixamorigHips: THREE.Bone;
    };
    materials: {
        WhiteClown_material: THREE.MeshStandardMaterial;
    };
    animations: GLTFAction[];
};

type ActionName = "Idle" | "Pulling" | "Running" | "Walking";
interface GLTFAction extends THREE.AnimationClip {
    name: ActionName;
}

type ContextType = Record<
    string,
    React.ForwardRefExoticComponent<
        JSX.IntrinsicElements["skinnedMesh"] | JSX.IntrinsicElements["bone"]
    >
>;

interface ClownProps extends GroupProps {
    targetPosition: [number, number, number];
}

export const Clown: React.FC<ClownProps> = (props) => {
    const group = useRef<THREE.Group>(null);
    const { nodes, materials, animations } = useGLTF(
        "/clown-transformed.glb"
    ) as GLTFResult;
    const { actions } = useAnimations<GLTFAction>(animations, group);

    const [currentState, setCurrentState] = useState<ActionName>("Idle");

    const { raycaster } = useThree();

    const decision = {
        left: false,
        right: false,
        forward: true,
    };
    let v = 0;

    useEffect(() => {
        actions.Idle?.play();
    }, [actions]);

    const setAnimation = (state: ActionName) => {
        if (currentState == state) return;
        if (actions && actions[state]) {
            actions[currentState]!.fadeOut(0.5);
            actions[state]!.reset().fadeIn(0.5).play();
            setCurrentState(state);
        }
    };

    useFrame((state, dt) => {
        if (!group.current) return;
        raycaster.set(
            group.current.position,
            new THREE.Vector3(
                Math.sin(group.current.rotation.y + Math.PI / 4),
                0,
                Math.cos(group.current.rotation.y + Math.PI / 4)
            ).normalize()
        );
        const leftRay = raycaster.intersectObjects(state.scene.children)[0];
        raycaster.set(
            new THREE.Vector3(...group.current.position),
            new THREE.Vector3(
                Math.sin(group.current.rotation.y),
                0,
                Math.cos(group.current.rotation.y)
            ).normalize()
        );
        const middleRay = raycaster.intersectObjects(state.scene.children)[0];
        raycaster.set(
            new THREE.Vector3(...group.current.position),
            new THREE.Vector3(
                Math.sin(group.current.rotation.y - Math.PI / 4),
                0,
                Math.cos(group.current.rotation.y - Math.PI / 4)
            ).normalize()
        );
        const rightRay = raycaster.intersectObjects(state.scene.children)[0];

        const leftSight = leftRay ? leftRay.distance : 10000;
        const rightSight = middleRay ? middleRay.distance : 10000;
        const middleSight = rightRay ? rightRay.distance : 10000;

        // Decision Heuristics
        if (middleSight < 30) decision.forward = false;
        if (
            distanceTo(
                ...props.targetPosition,
                ...group.current.position.toArray()
            ) < 30
        )
            decision.forward = false;
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
                decision.right = true;
            } else if (subAngle >= 183) {
                decision.left = true;
            }
        }

        if (decision.forward) {
            v = 4;
        }
        if (decision.left) {
            group.current.rotation.y += ((dt / 0.016) * 2 * Math.PI) / 180;
        }
        if (decision.right) {
            group.current.rotation.y -= ((dt / 0.016) * 2 * Math.PI) / 180;
        }

        const prev_position = group.current.position.clone();
        group.current.position.add(
            new THREE.Vector3(
                (dt / 0.016) * v * Math.sin(group.current.rotation.y),
                0,
                (dt / 0.016) * v * Math.cos(group.current.rotation.y)
            )
        );
        if (middleSight < 40)
            group.current.position.set(...prev_position.toArray());

        if (v > 0) {
            setAnimation("Running");
        } else if (v == 0) {
            setAnimation("Idle");
        }
    });

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <group
                    name="Armature"
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                >
                    <primitive object={nodes.mixamorigHips} />
                </group>
                <skinnedMesh
                    name="WhiteClown"
                    geometry={nodes.WhiteClown.geometry}
                    material={materials.WhiteClown_material}
                    skeleton={nodes.WhiteClown.skeleton}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
            </group>
        </group>
    );
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

function distanceTo(
    x1: number,
    y1: number,
    z1: number,
    x2: number,
    y2: number,
    z2: number
): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;

    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    return distance;
}
