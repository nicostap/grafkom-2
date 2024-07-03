import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import * as THREE from "three";

export function FloorTile(props: GroupProps) {
    const gltf = useGLTF("/Floor Tile.glb");

    const materials = gltf.materials;

    // Correct mesh typings
    const nodes = gltf.nodes as {
        [key: string]: THREE.Mesh;
    };

    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Floor_Modular.geometry}
                material={materials.Grey_Floor}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
            />
        </group>
    );
}

useGLTF.preload("/Floor Tile.glb");
