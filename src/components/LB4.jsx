import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

/**
 * @param {import("@react-three/fiber").GroupProps} props 
 */
export function LB4(props) {
    const { nodes, materials } = useGLTF("/LB4.glb");
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.large_buildingA_1.geometry}
                material={materials["border.002"]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.large_buildingA_1_1.geometry}
                material={materials["_defaultMat.002"]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.large_buildingA_1_2.geometry}
                material={materials["window.002"]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.large_buildingA_1_3.geometry}
                material={materials["door.002"]}
            />
        </group>
    );
}

useGLTF.preload("/LB4.glb");
