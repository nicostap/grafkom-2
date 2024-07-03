import { useGLTF, useAnimations } from "@react-three/drei";
import { useThree, useFrame, GroupProps } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

interface CharacterProps extends GroupProps {
    url: string;
}

export const Player: React.FC<CharacterProps> = (props) => {
    const group = useRef<THREE.Group>();
    const { nodes, materials, animations } = useGLTF(props.url);
    const { actions, mixer } = useAnimations(animations, group);

    const [currentState, setCurrentState] = useState<string>("");

    const { raycaster } = useThree();

    const [v, setV] = useState<number>(0);
    const [walkingSpeed, setWalkingSpeed] = useState<number>(1);
    const [cameraState, setCameraState] = useState<string>("TPS");
    const [cameraAngle, setCameraAngle] = useState<number>(0);

    useEffect(() => {
        if (mixer && actions) {
            actions["idle"]!.play();
            setCurrentState("idle");
        }
    }, [mixer, actions]);

    const setAnimation = (state: string) => {
        if (actions && actions[state]) {
            actions[currentState]!.fadeOut(0.5);
            actions[state]!.reset().fadeIn(0.5).play();
            setCurrentState(state);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case "W":
            case "w":
                setV(1);
                break;
            case "A":
            case "a":
                group.current!.rotation.y += ((1 / 0.016) * 2 * Math.PI) / 180;
                break;
            case "D":
            case "d":
                group.current!.rotation.y -= ((1 / 0.016) * 2 * Math.PI) / 180;
                break;
            case "Q":
            case "q":
                setCameraAngle(cameraAngle - (2 * Math.PI) / 180);
                break;
            case "E":
            case "e":
                setCameraAngle(cameraAngle + (2 * Math.PI) / 180);
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
            new THREE.Vector3(...group.current.position),
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

    return <group {...props}></group>;
};
