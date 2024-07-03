import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function LB2(props) {
  const { nodes, materials } = useGLTF('/LB2.glb')
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingD_1.geometry}
        material={materials['border.001']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingD_1_1.geometry}
        material={materials['window.001']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingD_1_2.geometry}
        material={materials['_defaultMat.001']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingD_1_3.geometry}
        material={materials['door.001']}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.large_buildingD_1_4.geometry}
        material={materials['roof.001']}
      />
    </group>
  )
}

useGLTF.preload('/LB2.glb')