import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import * as THREE from "three";

export function ModularWall(props: GroupProps) {
    const gltf = useGLTF("/Wall Modular.glb");
    const materials = gltf.materials;

    // Correct mesh typings
    const nodes = gltf.nodes as {
        [key: string]: THREE.Mesh;
    };

    return (
        <group {...props} dispose={null}>
            <group position={[0.889, 0, 0]} rotation={[0, 1.571, 0]}>
                <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Wall_Modular001_1.geometry}
                        material={materials.Wall_Dark}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Wall_Modular001_2.geometry}
                        material={materials.Wall_Medium}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Wall_Modular001_3.geometry}
                        material={materials.Wall_Highlights}
                    />
                </group>
                <group
                    position={[0, 0, -1.675]}
                    rotation={[-Math.PI / 2, 0, -Math.PI]}
                    scale={100}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Wall_Modular004_1.geometry}
                        material={materials.Wall_Dark}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Wall_Modular004_2.geometry}
                        material={materials.Wall_Medium}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.Wall_Modular004_3.geometry}
                        material={materials.Wall_Highlights}
                    />
                </group>
            </group>
            <group rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Wall_Modular_1.geometry}
                    material={materials.Wall_Dark}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Wall_Modular_2.geometry}
                    material={materials.Wall_Medium}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Wall_Modular_3.geometry}
                    material={materials.Wall_Highlights}
                />
            </group>
            <group
                position={[0, 0, -0.836]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Wall_Modular002_1.geometry}
                    material={materials.Wall_Dark}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Wall_Modular002_2.geometry}
                    material={materials.Wall_Medium}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Wall_Modular002_3.geometry}
                    material={materials.Wall_Highlights}
                />
            </group>
            <group
                position={[0, 0, 0.847]}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
            >
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Wall_Modular003_1.geometry}
                    material={materials.Wall_Dark}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Wall_Modular003_2.geometry}
                    material={materials.Wall_Medium}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Wall_Modular003_3.geometry}
                    material={materials.Wall_Highlights}
                />
            </group>
        </group>
    );
}

useGLTF.preload("/Wall Modular.glb");
