import { useGLTF } from "@react-three/drei";

/**
 * @param {import("@react-three/fiber").GroupProps} props 
 */
export function Street(props) {
    const { nodes, materials } = useGLTF("/jalan.glb");
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Street_Straight042.geometry}
                material={materials["Atlas.004"]}
                scale={180}
            />
        </group>
    );
}

useGLTF.preload("/jalan.glb");
