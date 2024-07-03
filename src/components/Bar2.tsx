import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { SimpleLight } from "./SimpleLight";

type GLTFResult = GLTF & {
    nodes: {
        Bar_mesh_1: THREE.Mesh;
        Bar_mesh_1_1: THREE.Mesh;
        Cylinder004: THREE.Mesh;
        Cylinder005: THREE.Mesh;
        Cylinder006: THREE.Mesh;
        Cylinder007: THREE.Mesh;
        Box007: THREE.Mesh;
        Box008: THREE.Mesh;
        Box009: THREE.Mesh;
        Box010: THREE.Mesh;
        Box011: THREE.Mesh;
        Box012: THREE.Mesh;
        Cylinder002: THREE.Mesh;
        Box007001: THREE.Mesh;
        Box008001: THREE.Mesh;
        Box009001: THREE.Mesh;
        Box010001: THREE.Mesh;
        Box011001: THREE.Mesh;
        Box012001: THREE.Mesh;
        Cylinder002001: THREE.Mesh;
        Box007002: THREE.Mesh;
        Box008002: THREE.Mesh;
        Box009002: THREE.Mesh;
        Box010002: THREE.Mesh;
        Box011002: THREE.Mesh;
        Box012002: THREE.Mesh;
        Cylinder002002: THREE.Mesh;
        Box007003: THREE.Mesh;
        Box008003: THREE.Mesh;
        Box009003: THREE.Mesh;
        Box010003: THREE.Mesh;
        Box011003: THREE.Mesh;
        Box012003: THREE.Mesh;
        Cylinder002003: THREE.Mesh;
        Cylinder004001: THREE.Mesh;
        Cylinder005001: THREE.Mesh;
        Cylinder006001: THREE.Mesh;
        Cylinder007001: THREE.Mesh;
        Box007004: THREE.Mesh;
        Box008004: THREE.Mesh;
        Box009004: THREE.Mesh;
        Box010004: THREE.Mesh;
        Box011004: THREE.Mesh;
        Box012004: THREE.Mesh;
        Cylinder002004: THREE.Mesh;
        Box007005: THREE.Mesh;
        Box008005: THREE.Mesh;
        Box009005: THREE.Mesh;
        Box010005: THREE.Mesh;
        Box011005: THREE.Mesh;
        Box012005: THREE.Mesh;
        Cylinder002005: THREE.Mesh;
        Box007006: THREE.Mesh;
        Box008006: THREE.Mesh;
        Box009006: THREE.Mesh;
        Box010006: THREE.Mesh;
        Box011006: THREE.Mesh;
        Box012006: THREE.Mesh;
        Cylinder002006: THREE.Mesh;
        Box007007: THREE.Mesh;
        Box008007: THREE.Mesh;
        Box009007: THREE.Mesh;
        Box010007: THREE.Mesh;
        Box011007: THREE.Mesh;
        Box012007: THREE.Mesh;
        Cylinder002007: THREE.Mesh;
        Box007008: THREE.Mesh;
        Box008008: THREE.Mesh;
        Box009008: THREE.Mesh;
        Box010008: THREE.Mesh;
        Box011008: THREE.Mesh;
        Box012008: THREE.Mesh;
        Cylinder002008: THREE.Mesh;
        Box007009: THREE.Mesh;
        Box008009: THREE.Mesh;
        Box009009: THREE.Mesh;
        Box010009: THREE.Mesh;
        Box011009: THREE.Mesh;
        Box012009: THREE.Mesh;
        Cylinder002009: THREE.Mesh;
        Door: THREE.Mesh;
        Glass15: THREE.Mesh;
        Door001: THREE.Mesh;
        Glass15001: THREE.Mesh;
        ["Node-Mesh001"]: THREE.Mesh;
        ["Node-Mesh001_1"]: THREE.Mesh;
        ["Node-Mesh001_2"]: THREE.Mesh;
        mesh732647983: THREE.Mesh;
        mesh732647983_1: THREE.Mesh;
        mesh732647983_2: THREE.Mesh;
        mesh732647983_3: THREE.Mesh;
        mesh732647983_4: THREE.Mesh;
        mesh732647983_5: THREE.Mesh;
        sercups_glass_Cylinder015: THREE.Mesh;
        sercups_glass_Cylinder016: THREE.Mesh;
        sercups_glass_Cylinder017: THREE.Mesh;
        sercups_glass_Cylinder018: THREE.Mesh;
        sercups_glass_Cylinder019: THREE.Mesh;
        sercups_glass_Cylinder022: THREE.Mesh;
        ["Node-Mesh002"]: THREE.Mesh;
        ["Node-Mesh002_1"]: THREE.Mesh;
        ["Node-Mesh002_2"]: THREE.Mesh;
        sercups_glass_Cylinder001: THREE.Mesh;
        sercups_glass_Cylinder002: THREE.Mesh;
        sercups_glass_Cylinder003: THREE.Mesh;
        sercups_glass_Cylinder004: THREE.Mesh;
        sercups_glass_Cylinder005: THREE.Mesh;
        sercups_glass_Cylinder006: THREE.Mesh;
        sercups_glass_Cylinder007: THREE.Mesh;
        sercups_glass_Cylinder008: THREE.Mesh;
        sercups_glass_Cylinder009: THREE.Mesh;
        CeilingLamp4_1: THREE.Mesh;
        CeilingLamp4_2: THREE.Mesh;
        CeilingLamp4001_1: THREE.Mesh;
        CeilingLamp4001_2: THREE.Mesh;
        CeilingLamp4002_1: THREE.Mesh;
        CeilingLamp4002_2: THREE.Mesh;
        CeilingLamp4003_1: THREE.Mesh;
        CeilingLamp4003_2: THREE.Mesh;
        CeilingLamp4004_1: THREE.Mesh;
        CeilingLamp4004_2: THREE.Mesh;
        CeilingLamp4005_1: THREE.Mesh;
        CeilingLamp4005_2: THREE.Mesh;
        CeilingLamp4006_1: THREE.Mesh;
        CeilingLamp4006_2: THREE.Mesh;
        Cube001: THREE.Mesh;
        Cube002: THREE.Mesh;
        Cube004: THREE.Mesh;
        Cube003: THREE.Mesh;
        Cube005: THREE.Mesh;
        Cylinder: THREE.Mesh;
        Cylinder001: THREE.Mesh;
        Cylinder002_1: THREE.Mesh;
        Cylinder003: THREE.Mesh;
    };
    materials: {
        Bar_A_mat: THREE.MeshStandardMaterial;
        Bar_B_mat: THREE.MeshStandardMaterial;
        ["02___Default"]: THREE.MeshStandardMaterial;
        ["_crayfishdiffuse.001"]: THREE.MeshStandardMaterial;
        ["02___Default.001"]: THREE.MeshStandardMaterial;
        lambert3SG: THREE.MeshStandardMaterial;
        mat25: THREE.MeshStandardMaterial;
        mat24: THREE.MeshStandardMaterial;
        mat8: THREE.MeshStandardMaterial;
        magnifying_glass_01_lense: THREE.MeshPhysicalMaterial;
        mat18: THREE.MeshStandardMaterial;
        mat15: THREE.MeshStandardMaterial;
        mat19: THREE.MeshStandardMaterial;
        mat11: THREE.MeshStandardMaterial;
        mat13: THREE.MeshStandardMaterial;
        ["magnifying_glass_01_lense.001"]: THREE.MeshPhysicalMaterial;
        ["mat24.002"]: THREE.MeshStandardMaterial;
        ["mat8.001"]: THREE.MeshStandardMaterial;
        MetalCeilingLamp4: THREE.MeshStandardMaterial;
        LightCeilingLamp4: THREE.MeshStandardMaterial;
        ["Material.001"]: THREE.MeshStandardMaterial;
        ["Material.002"]: THREE.MeshStandardMaterial;
        ["Material.003"]: THREE.MeshStandardMaterial;
        ["Material.004"]: THREE.MeshStandardMaterial;
    };
};

export function Bar2(props: JSX.IntrinsicElements["group"]) {
    const { nodes, materials } = useGLTF(
        "/maps/bar_indoor_try.glb"
    ) as GLTFResult;
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder004.geometry}
                material={materials["02___Default"]}
                position={[12.078, 0.575, 33.24]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder005.geometry}
                material={materials["02___Default"]}
                position={[12.078, 0.575, 33.24]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder006.geometry}
                material={materials["02___Default"]}
                position={[12.078, 0.575, 33.24]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder007.geometry}
                material={materials["02___Default"]}
                position={[12.078, 0.575, 33.24]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.123, 0.596, 15.991]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.123, 0.596, 15.991]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.123, 0.596, 15.991]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.123, 0.596, 15.991]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.123, 0.596, 15.991]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.123, 0.596, 15.991]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002.geometry}
                material={materials["02___Default.001"]}
                position={[7.123, 0.596, 15.991]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007001.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.453, 0.596, 20.012]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008001.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.453, 0.596, 20.012]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009001.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.453, 0.596, 20.012]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010001.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.453, 0.596, 20.012]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011001.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.453, 0.596, 20.012]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012001.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[7.453, 0.596, 20.012]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002001.geometry}
                material={materials["02___Default.001"]}
                position={[7.453, 0.596, 20.012]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007002.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 21.653]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008002.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 21.653]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009002.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 21.653]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010002.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 21.653]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011002.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 21.653]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012002.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 21.653]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002002.geometry}
                material={materials["02___Default.001"]}
                position={[11.432, 0.596, 21.653]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007003.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 13.651]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008003.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 13.651]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009003.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 13.651]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010003.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 13.651]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011003.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 13.651]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012003.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[11.432, 0.596, 13.651]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002003.geometry}
                material={materials["02___Default.001"]}
                position={[11.432, 0.596, 13.651]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder004001.geometry}
                material={materials["02___Default"]}
                position={[-9.409, 0.575, 36.585]}
                rotation={[0, -0.604, 0]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder005001.geometry}
                material={materials["02___Default"]}
                position={[-9.409, 0.575, 36.585]}
                rotation={[0, -0.604, 0]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder006001.geometry}
                material={materials["02___Default"]}
                position={[-9.409, 0.575, 36.585]}
                rotation={[0, -0.604, 0]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder007001.geometry}
                material={materials["02___Default"]}
                position={[-9.409, 0.575, 36.585]}
                rotation={[0, -0.604, 0]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007004.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[2.186, 0.596, 17.204]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008004.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[2.186, 0.596, 17.204]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009004.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[2.186, 0.596, 17.204]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010004.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[2.186, 0.596, 17.204]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011004.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[2.186, 0.596, 17.204]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012004.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[2.186, 0.596, 17.204]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002004.geometry}
                material={materials["02___Default.001"]}
                position={[2.186, 0.596, 17.204]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007005.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[1.503, 0.596, 23.035]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008005.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[1.503, 0.596, 23.035]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009005.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[1.503, 0.596, 23.035]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010005.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[1.503, 0.596, 23.035]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011005.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[1.503, 0.596, 23.035]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012005.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[1.503, 0.596, 23.035]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002005.geometry}
                material={materials["02___Default.001"]}
                position={[1.503, 0.596, 23.035]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007006.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.957, 0.596, 23.777]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008006.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.957, 0.596, 23.777]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009006.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.957, 0.596, 23.777]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010006.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.957, 0.596, 23.777]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011006.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.957, 0.596, 23.777]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012006.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.957, 0.596, 23.777]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002006.geometry}
                material={materials["02___Default.001"]}
                position={[-3.957, 0.596, 23.777]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007007.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.662, 0.596, 17.345]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008007.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.662, 0.596, 17.345]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009007.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.662, 0.596, 17.345]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010007.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.662, 0.596, 17.345]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011007.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.662, 0.596, 17.345]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012007.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-3.662, 0.596, 17.345]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002007.geometry}
                material={materials["02___Default.001"]}
                position={[-3.662, 0.596, 17.345]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007008.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.33, 0.596, 16.363]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008008.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.33, 0.596, 16.363]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009008.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.33, 0.596, 16.363]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010008.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.33, 0.596, 16.363]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011008.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.33, 0.596, 16.363]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012008.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.33, 0.596, 16.363]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002008.geometry}
                material={materials["02___Default.001"]}
                position={[-1.33, 0.596, 16.363]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box007009.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.228, 0.596, 24.513]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box008009.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.228, 0.596, 24.513]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box009009.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.228, 0.596, 24.513]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box010009.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.228, 0.596, 24.513]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box011009.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.228, 0.596, 24.513]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Box012009.geometry}
                material={materials["_crayfishdiffuse.001"]}
                position={[-1.228, 0.596, 24.513]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002009.geometry}
                material={materials["02___Default.001"]}
                position={[-1.228, 0.596, 24.513]}
                scale={0}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Door.geometry}
                material={materials.lambert3SG}
                position={[-2.07, 0, 36.336]}
                scale={0.022}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Glass15.geometry}
                material={materials.lambert3SG}
                position={[-2.07, 0, 36.336]}
                scale={0.022}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Door001.geometry}
                material={materials.lambert3SG}
                position={[1.31, 0, 36.129]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={0.022}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Glass15001.geometry}
                material={materials.lambert3SG}
                position={[1.31, 0, 36.336]}
                rotation={[Math.PI, 0, Math.PI]}
                scale={0.022}
            />
            <group position={[-0.73, 2.723, -2.748]}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.mesh732647983.geometry}
                    material={materials.magnifying_glass_01_lense}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.mesh732647983_1.geometry}
                    material={materials.mat18}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.mesh732647983_2.geometry}
                    material={materials.mat15}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.mesh732647983_3.geometry}
                    material={materials.mat19}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.mesh732647983_4.geometry}
                    material={materials.mat11}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.mesh732647983_5.geometry}
                    material={materials.mat13}
                />
            </group>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder015.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.387, 2.85, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder016.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.387, 2.939, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder017.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.387, 3.027, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder018.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.387, 3.116, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder019.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.387, 3.205, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder022.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[3.411, 2.85, -2.612]}
                scale={0.152}
            />
            <group position={[0, 2.911, -2.8]}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes["Node-Mesh002"].geometry}
                    material={materials.magnifying_glass_01_lense}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes["Node-Mesh002_1"].geometry}
                    material={materials["mat24.002"]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes["Node-Mesh002_2"].geometry}
                    material={materials["mat8.001"]}
                />
            </group>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder001.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.048, 2.85, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder002.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.048, 2.939, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder003.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.048, 3.027, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder004.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.048, 3.116, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder005.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.048, 3.205, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder006.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[3.718, 2.85, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder007.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[3.718, 2.939, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder008.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[3.718, 3.027, -2.612]}
                scale={0.152}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.sercups_glass_Cylinder009.geometry}
                material={materials["magnifying_glass_01_lense.001"]}
                position={[4.048, 3.294, -2.612]}
                scale={0.152}
            />
            <group position={[0, 7.753, 0]} scale={1.905}>
                <group
                    position={[-2.651, 0.168, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4_1.geometry}
                        material={materials.MetalCeilingLamp4}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4_2.geometry}
                        material={materials.LightCeilingLamp4}
                    />
                    <SimpleLight
                        helper
                        position={[0, 0, -0.001]}
                        intensity={Math.PI}
                        castShadow
                        decay={0.1}
                        targetPosition={[0, 0, -10]}
                        angle={Math.PI / 3}
                        color="EDFF96"
                    />
                </group>
                <group
                    position={[2.6, 0.168, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4001_1.geometry}
                        material={materials.MetalCeilingLamp4}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4001_2.geometry}
                        material={materials.LightCeilingLamp4}
                    />
                    <SimpleLight
                        helper
                        position={[0, 0, -0.001]}
                        intensity={Math.PI}
                        castShadow
                        decay={0.1}
                        targetPosition={[0, 0, -10]}
                        angle={Math.PI / 3}
                        color="EDFF96"
                    />
                </group>
                <group
                    position={[-2.651, 0.168, 7.045]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4002_1.geometry}
                        material={materials.MetalCeilingLamp4}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4002_2.geometry}
                        material={materials.LightCeilingLamp4}
                    />
                    <SimpleLight
                        helper
                        position={[0, 0, -0.001]}
                        intensity={Math.PI}
                        castShadow
                        decay={0.1}
                        targetPosition={[0, 0, -10]}
                        angle={Math.PI / 3}
                        color="EDFF96"
                    />
                </group>
                <group
                    position={[2.6, 0.168, 7.045]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4003_1.geometry}
                        material={materials.MetalCeilingLamp4}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4003_2.geometry}
                        material={materials.LightCeilingLamp4}
                    />
                    <SimpleLight
                        helper
                        position={[0, 0, -0.001]}
                        intensity={Math.PI}
                        castShadow
                        decay={0.1}
                        targetPosition={[0, 0, -10]}
                        angle={Math.PI / 3}
                        color="EDFF96"
                    />
                </group>
                <group
                    position={[-2.651, 0.168, 14.089]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4004_1.geometry}
                        material={materials.MetalCeilingLamp4}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4004_2.geometry}
                        material={materials.LightCeilingLamp4}
                    />
                    <SimpleLight
                        helper
                        position={[0, 0, -0.001]}
                        intensity={Math.PI}
                        castShadow
                        decay={0.1}
                        targetPosition={[0, 0, -10]}
                        angle={Math.PI / 3}
                        color="EDFF96"
                    />
                </group>
                <group
                    position={[2.6, 0.168, 14.089]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4005_1.geometry}
                        material={materials.MetalCeilingLamp4}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4005_2.geometry}
                        material={materials.LightCeilingLamp4}
                    />
                    <SimpleLight
                        helper
                        position={[0, 0, -0.001]}
                        intensity={Math.PI}
                        castShadow
                        decay={0.1}
                        targetPosition={[0, 0, -10]}
                        angle={Math.PI / 3}
                        color="EDFF96"
                    />
                </group>
                <group
                    position={[0.777, -0.229, -2.344]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={100}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4006_1.geometry}
                        material={materials.MetalCeilingLamp4}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.CeilingLamp4006_2.geometry}
                        material={materials.LightCeilingLamp4}
                    />
                    <SimpleLight
                        helper
                        position={[0, 0, -0.001]}
                        intensity={Math.PI}
                        castShadow
                        decay={0.1}
                        targetPosition={[0, 0, -10]}
                        angle={Math.PI / 3}
                        color="EDFF96"
                    />
                </group>
            </group>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube001.geometry}
                material={materials["Material.001"]}
                position={[10.934, 4.293, 14.33]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[23.215, 4.235, 0.626]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube002.geometry}
                material={materials["Material.002"]}
                position={[0.002, 0.446, 16.615]}
                rotation={[-Math.PI, 0, -Math.PI]}
                scale={[-11.942, -0.152, -25.34]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube004.geometry}
                material={materials["Material.003"]}
                position={[0.002, 8.149, 16.615]}
                rotation={[-Math.PI, 0, -Math.PI]}
                scale={[-11.942, -0.152, -25.34]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube003.geometry}
                material={materials["Material.001"]}
                position={[-10.379, 4.293, 14.33]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[23.215, 4.235, 0.709]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube005.geometry}
                material={materials["Material.001"]}
                position={[0, 4.293, 37.307]}
                scale={[11.044, 4.235, 0.626]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder.geometry}
                material={materials["Material.004"]}
                position={[-5.534, 2.714, 20.478]}
                rotation={[-Math.PI, 0, -Math.PI]}
                scale={[-2.75, -0.08, -2.75]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder001.geometry}
                material={materials.magnifying_glass_01_lense}
                position={[-5.534, 2.714, 20.478]}
                rotation={[-Math.PI, 0, -Math.PI]}
                scale={[-2.6, -0.08, -2.6]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder002_1.geometry}
                material={materials["Material.004"]}
                position={[6.25, 2.714, 17.772]}
                rotation={[-Math.PI, 0, -Math.PI]}
                scale={[-2.75, -0.08, -2.75]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder003.geometry}
                material={materials.magnifying_glass_01_lense}
                position={[6.25, 2.714, 17.772]}
                rotation={[-Math.PI, 0, -Math.PI]}
                scale={[-2.6, -0.08, -2.6]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_mesh_1.geometry}
                material={materials.Bar_A_mat}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Bar_mesh_1_1.geometry}
                material={materials.Bar_B_mat}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["Node-Mesh001"].geometry}
                material={materials.mat25}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["Node-Mesh001_1"].geometry}
                material={materials.mat24}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes["Node-Mesh001_2"].geometry}
                material={materials.mat8}
            />
        </group>
    );
}

useGLTF.preload("/maps/bar_indoor_try.glb");
