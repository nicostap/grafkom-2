import { useGLTF, useAnimations } from "@react-three/drei";
import { useThree, useFrame, GroupProps } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

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
    updatePosition: React.Dispatch<React.SetStateAction<[number, number, number]>>;
}

export const Player: React.FC<PlayerProps> = (props) => {
    const group = useRef<THREE.Group>(null);
    const { nodes, materials, animations } = useGLTF(
        "/victim2-transformed.glb"
    ) as GLTFResult;
    const { actions } = useAnimations<GLTFAction>(animations, group);

    const [currentState, setCurrentState] = useState<ActionName>("Idle");

    const { raycaster } = useThree();

    const [v, setV] = useState<number>(0);
    const [walkingSpeed, setWalkingSpeed] = useState<number>(1);
    const [cameraState, setCameraState] = useState<string>("TPS");
    const [cameraAngle, setCameraAngle] = useState<number>(0);

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

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!group.current) return;
        switch (event.key) {
            case "W":
            case "w":
                setV(1);
                break;
            case "S":
            case "s":
                setV(-1);
                break;
            case "A":
            case "a":
                group.current.rotation.y += ((1 / 0.016) * 2 * Math.PI) / 180;
                setCameraAngle(cameraAngle + (2 * Math.PI) / 180);
                break;
            case "D":
            case "d":
                group.current.rotation.y -= ((1 / 0.016) * 2 * Math.PI) / 180;
                setCameraAngle(cameraAngle - (2 * Math.PI) / 180);
                break;
            case "Shift":
                setWalkingSpeed(3);
                break;
            default:
                break;
        }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
        switch (event.key) {
            case "W":
            case "w":
            case "S":
            case "s":
                setV(0);
                break;
            case "Shift":
                setWalkingSpeed(1);
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

        raycaster.set(
            new THREE.Vector3(group.current.position.x, 150, group.current.position.z),
            new THREE.Vector3(
                Math.sin(group.current.rotation.y),
                0,
                Math.cos(group.current.rotation.y)
            ).normalize()
        );
        const middleSight = raycaster.intersectObjects(state.scene.children)[0]
            .distance;

        const prev_position = group.current.position.clone();
        group.current.position.add(
            new THREE.Vector3(
                (dt / 0.016) *
                    walkingSpeed *
                    v *
                    Math.sin(group.current.rotation.y),
                0,
                (dt / 0.016) *
                    walkingSpeed *
                    v *
                    Math.cos(group.current.rotation.y)
            )
        );
        if (middleSight < 40)
            group.current.position.set(...prev_position.toArray());

        props.updatePosition(group.current.position.toArray());

        if (v == 1) {
            if (walkingSpeed == 1) {
                setAnimation("Walking");
            } else {
                setAnimation("Running");
            }
        } else if (v == -1) {
            setAnimation("WalkingBackwards");
        } else if (v == 0) {
            setAnimation("Idle");
        }

        if (cameraState == "TPS") {
            let cameraDistance = 300;
            let intersects = [];
            do {
                state.camera.position.set(
                    group.current.position.x -
                        cameraDistance * Math.sin(cameraAngle),
                    150 +
                        group.current.position.y +
                        cameraDistance * Math.sin(Math.PI / 9),
                    group.current.position.z -
                        cameraDistance * Math.cos(cameraAngle)
                );
                state.camera.lookAt(
                    group.current.position.x,
                    150,
                    group.current.position.z
                );

                const direction = new THREE.Vector3();
                state.camera.getWorldDirection(direction);
                raycaster.set(state.camera.position, direction);

                intersects = raycaster.intersectObjects(
                    state.scene.children,
                    true
                );
                cameraDistance -= 10;
            } while (intersects.length > 0 && intersects[0].distance < 1);
        } else if (cameraState == "FPS") {
            state.camera.position.set(
                group.current.position.x,
                185,
                group.current.position.z
            );
            state.camera.rotation.set(0, group.current.rotation.y + Math.PI, 0);
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
}

useGLTF.preload("/victim2-transformed.glb");
