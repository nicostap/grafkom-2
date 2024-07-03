import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function LB1(props) {
  const { nodes, materials } = useGLTF('/LB1.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingC_1.geometry}
        material={materials.roof}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingC_1_1.geometry}
        material={materials.window}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingC_1_2.geometry}
        material={materials.door}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingC_1_3.geometry}
        material={materials.door}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingC_1_4.geometry}
        material={materials._defaultMat}
      />
    </group>
  )
}

useGLTF.preload('/LB1.glb')