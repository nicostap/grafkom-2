import { useHelper } from "@react-three/drei";
import { SpotLightProps } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export interface SimpleLightProps extends SpotLightProps {
    helper?: boolean;
    targetPosition?: [number, number, number];
}

export function SimpleLight(props: SimpleLightProps) {
    const spotlight = useMemo(() => new THREE.SpotLight(), []);

    return (
        <>
            <primitive object={spotlight} {...props} castShadow />

            <primitive
                object={spotlight.target}
                position={props.targetPosition}
            />

            {/* <spotLightHelper args={[spotlight, "#FF0000"]} /> */}
        </>
    );
}
