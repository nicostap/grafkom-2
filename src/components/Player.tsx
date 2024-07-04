import { useGLTF, useAnimations } from "@react-three/drei";
import { useThree, useFrame, GroupProps } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { SimpleLight } from "./SimpleLight";
import { Group } from "three";

type GLTFResult = GLTF & {
    nodes: {
        Ch31_Body: THREE.SkinnedMesh;
        Ch31_Collar: THREE.SkinnedMesh;
        Ch31_Eyelashes: THREE.SkinnedMesh;
        Ch31_Hair: THREE.SkinnedMesh;
        Ch31_Pants: THREE.SkinnedMesh;
        Ch31_Shoes: THREE.SkinnedMesh;
        Ch31_Sweater: THREE.SkinnedMesh;
        mixamorig9Hips: THREE.Bone;
    };
    materials: {
        Ch31_body: THREE.MeshStandardMaterial;
        Ch31_hair: THREE.MeshStandardMaterial;
    };
    animations: GLTFAction[];
};

type ActionName =
    | "Armature.004|mixamo.com|Layer0"
    | "Idle"
    | "Running"
    | "Walking"
    | "Walking.001"
    | "WalkingBackwards";

interface GLTFAction extends THREE.AnimationClip {
    name: ActionName;
}

type ContextType = Record<
    string,
    React.ForwardRefExoticComponent<
        JSX.IntrinsicElements["skinnedMesh"] | JSX.IntrinsicElements["bone"]
    >
>;

interface PlayerProps extends GroupProps {
    updatePosition: React.MutableRefObject<[number, number, number]>;
}

export const Player: React.FC<PlayerProps> = (props) => {
    const group = useRef<THREE.Group>(null);
    const { nodes, materials, animations } = useGLTF(
        "/victim2-transformed copy 2.glb"
    ) as GLTFResult;
    const { actions } = useAnimations<GLTFAction>(animations, group);

    const currentState = useRef<ActionName>("Idle");

    const { raycaster } = useThree();

    const v = useRef<number>(0);
    const walkingSpeed = useRef<number>(1);
    const [cameraState, setCameraState] = useState<string>("TPS");
    const cameraAngle = useRef<number>(Math.PI);
    const cameraVerticalAngle = useRef<number>(Math.PI / 9);
    const userCameraDistance = useRef<number>(500);

    const keyState = useRef<Record<string, boolean>>({});

    useEffect(() => {
        actions.Idle?.play();
    }, [actions]);

    const crossFade = (state: ActionName, duration = 0.1) => {
        if (currentState.current == state) return;
        if (!actions[state] || !actions[currentState.current]) return;
        setWeight(state, 1);
        actions[state]!.time = 0;
        actions[currentState.current]!.crossFadeTo(
            actions[state]!,
            duration,
            true
        );
        actions[state]!.play();
        currentState.current = state;
    };
    const setWeight = (state: ActionName, weight: number) => {
        actions[state]!.enabled = true;
        actions[state]!.setEffectiveTimeScale(1);
        actions[state]!.setEffectiveWeight(weight);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!group.current) return;
        const k = e.code;

        keyState.current[k] = true;

        switch (k) {
            case "KeyW":
                v.current = 1;
                break;
            case "KeyS":
                v.current = -1;
                break;
            case "ShiftLeft":
                walkingSpeed.current = 2;
                break;
            default:
                break;
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        const k = e.code;

        keyState.current[k] = false;

        switch (k) {
            case "KeyW":
            case "KeyS":
                v.current = 0;
                break;
            case "ShiftLeft":
                walkingSpeed.current = 1;
                break;
            case " ":
                setCameraState(cameraState == "TPS" ? "FPS" : "TPS");
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    });

    useFrame((state, dt) => {
        if (!group.current) return;

        if (keyState.current["KeyA"]) group.current.rotation.y += Math.PI * dt;
        if (keyState.current["KeyD"]) group.current.rotation.y -= Math.PI * dt;

        const prev_position = group.current.position.clone();
        group.current.position.add(
            new THREE.Vector3(
                5 *
                    (dt / 0.016) *
                    walkingSpeed.current *
                    v.current *
                    Math.sin(group.current.rotation.y),
                0,
                5 *
                    (dt / 0.016) *
                    walkingSpeed.current *
                    v.current *
                    Math.cos(group.current.rotation.y)
            )
        );
        raycaster.set(
            new THREE.Vector3(
                group.current.position.x,
                100,
                group.current.position.z
            ),
            new THREE.Vector3(
                Math.sin(group.current.rotation.y),
                0,
                Math.cos(group.current.rotation.y)
            ).normalize()
        );
        const middleRay = raycaster.intersectObjects(state.scene.children)[0];
        const middleSight = middleRay ? middleRay.distance : 10000;

        if (middleSight < 40)
            group.current.position.set(...prev_position.toArray());

        props.updatePosition.current = group.current.position.toArray();

        if (v.current == 1) {
            if (walkingSpeed.current == 1) {
                crossFade("Walking");
            } else {
                crossFade("Running");
            }
        } else if (v.current == -1) {
            crossFade("WalkingBackwards");
        } else if (v.current == 0) {
            crossFade("Idle");
        }

        if (cameraState == "TPS") {
            const maxCameraDistance = 500;

            // Adjust rotation based on arrow keys
            if (keyState.current["ArrowLeft"]) cameraAngle.current -= 2 * dt;
            if (keyState.current["ArrowRight"]) cameraAngle.current += 2 * dt;

            if (keyState.current["KeyQ"])
                userCameraDistance.current -= 300 * dt;
            if (keyState.current["KeyE"])
                userCameraDistance.current += 300 * dt;

            if (userCameraDistance.current < 300)
                userCameraDistance.current = 300;
            if (userCameraDistance.current > maxCameraDistance)
                userCameraDistance.current = maxCameraDistance;

            if (keyState.current["ArrowUp"])
                cameraVerticalAngle.current = Math.max(
                    cameraVerticalAngle.current - 2 * dt,
                    0
                );
            if (keyState.current["ArrowDown"])
                cameraVerticalAngle.current = Math.min(
                    cameraVerticalAngle.current + 2 * dt,
                    Math.PI / 2
                );

            let cameraInside = false;
            let cameraDistance = userCameraDistance.current;
            state.camera.position.set(
                group.current.position.x -
                    cameraDistance * Math.sin(cameraAngle.current),
                150 +
                    group.current.position.y +
                    cameraDistance * Math.sin(cameraVerticalAngle.current),
                group.current.position.z -
                    cameraDistance * Math.cos(cameraAngle.current)
            );

            state.camera.lookAt(
                group.current.position.x,
                150,
                group.current.position.z
            );

            const direction = new THREE.Vector3();
            state.camera.getWorldDirection(direction);
            raycaster.set(
                new THREE.Vector3(
                    group.current.position.x,
                    150,
                    group.current.position.z
                ),
                direction.multiplyScalar(-1)
            );

            const intersect = raycaster.intersectObjects(state.scene.children);
            const intersectDistance = intersect[0]
                ? intersect[0].distance
                : userCameraDistance.current;
            cameraDistance =
                Math.min(intersectDistance, userCameraDistance.current) - 75;

            state.camera.position.set(
                group.current.position.x -
                    cameraDistance * Math.sin(cameraAngle.current),
                150 +
                    group.current.position.y +
                    cameraDistance * Math.sin(cameraVerticalAngle.current),
                group.current.position.z -
                    cameraDistance * Math.cos(cameraAngle.current)
            );
        } else if (cameraState == "FPS") {
            state.camera.position.set(
                group.current.position.x,
                200,
                group.current.position.z
            );
            state.camera.rotation.set(0, group.current.rotation.y + Math.PI, 0);
        }
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {group.current && (
                <SimpleLight
                    position={[
                        group.current?.position.x,
                        300,
                        group.current?.position.z,
                    ]}
                    intensity={Math.PI}
                    decay={0.2}
                    targetPosition={[
                        group.current?.position.x,
                        0,
                        group.current?.position.z,
                    ]}
                    angle={Math.PI / 3}
                    penumbra={0.75}
                    color={new THREE.Color(0xffb84c)}
                />
            )}
            <group name="Scene">
                <group
                    name="Armature"
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                >
                    <primitive object={nodes.mixamorig9Hips} />
                </group>
                <skinnedMesh
                    name="Ch31_Body"
                    geometry={nodes.Ch31_Body.geometry}
                    material={materials.Ch31_body}
                    skeleton={nodes.Ch31_Body.skeleton}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
                <skinnedMesh
                    name="Ch31_Collar"
                    geometry={nodes.Ch31_Collar.geometry}
                    material={materials.Ch31_body}
                    skeleton={nodes.Ch31_Collar.skeleton}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
                <skinnedMesh
                    name="Ch31_Eyelashes"
                    geometry={nodes.Ch31_Eyelashes.geometry}
                    material={materials.Ch31_hair}
                    skeleton={nodes.Ch31_Eyelashes.skeleton}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
                <skinnedMesh
                    name="Ch31_Hair"
                    geometry={nodes.Ch31_Hair.geometry}
                    material={materials.Ch31_hair}
                    skeleton={nodes.Ch31_Hair.skeleton}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
                <skinnedMesh
                    name="Ch31_Pants"
                    geometry={nodes.Ch31_Pants.geometry}
                    material={materials.Ch31_body}
                    skeleton={nodes.Ch31_Pants.skeleton}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
                <skinnedMesh
                    name="Ch31_Shoes"
                    geometry={nodes.Ch31_Shoes.geometry}
                    material={materials.Ch31_body}
                    skeleton={nodes.Ch31_Shoes.skeleton}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
                <skinnedMesh
                    name="Ch31_Sweater"
                    geometry={nodes.Ch31_Sweater.geometry}
                    material={materials.Ch31_body}
                    skeleton={nodes.Ch31_Sweater.skeleton}
                    rotation={[Math.PI / 2, 0, 0]}
                    scale={0.01}
                />
            </group>
        </group>
    );
};

useGLTF.preload("/victim2-transformed copy 2.glb");
