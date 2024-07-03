import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function LB3(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/LB3.glb')
  const { actions } = useAnimations(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="large_buildingG">
          <mesh
            name="large_buildingG_1"
            castShadow
            receiveShadow
            geometry={nodes.large_buildingG_1.geometry}
            material={materials['door.003']}
          />
          <mesh
            name="large_buildingG_1_1"
            castShadow
            receiveShadow
            geometry={nodes.large_buildingG_1_1.geometry}
            material={materials['window.003']}
          />
          <mesh
            name="large_buildingG_1_2"
            castShadow
            receiveShadow
            geometry={nodes.large_buildingG_1_2.geometry}
            material={materials['_defaultMat.003']}
          />
          <mesh
            name="large_buildingG_1_3"
            castShadow
            receiveShadow
            geometry={nodes.large_buildingG_1_3.geometry}
            material={materials['border.003']}
          />
        </group>
        <group
          name="RootNode"
          position={[-0.872, 0.446, -0.513]}
          rotation={[Math.PI, 0, Math.PI]}
          scale={0.071}>
          <group name="HumanArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <group name="BaseHuman">
              <skinnedMesh
                name="BaseHuman_1"
                geometry={nodes.BaseHuman_1.geometry}
                material={materials.Shirt}
                skeleton={nodes.BaseHuman_1.skeleton}
              />
              <skinnedMesh
                name="BaseHuman_2"
                geometry={nodes.BaseHuman_2.geometry}
                material={materials.Skin}
                skeleton={nodes.BaseHuman_2.skeleton}
              />
              <skinnedMesh
                name="BaseHuman_3"
                geometry={nodes.BaseHuman_3.geometry}
                material={materials.Pants}
                skeleton={nodes.BaseHuman_3.skeleton}
              />
              <skinnedMesh
                name="BaseHuman_4"
                geometry={nodes.BaseHuman_4.geometry}
                material={materials.Eyes}
                skeleton={nodes.BaseHuman_4.skeleton}
              />
              <skinnedMesh
                name="BaseHuman_5"
                geometry={nodes.BaseHuman_5.geometry}
                material={materials.Socks}
                skeleton={nodes.BaseHuman_5.skeleton}
              />
              <skinnedMesh
                name="BaseHuman_6"
                geometry={nodes.BaseHuman_6.geometry}
                material={materials.Hair}
                skeleton={nodes.BaseHuman_6.skeleton}
              />
            </group>
            <primitive object={nodes.Bone} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/LB3.glb')