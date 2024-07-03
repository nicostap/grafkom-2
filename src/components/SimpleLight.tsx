import { useHelper } from "@react-three/drei";
import { SpotLightProps } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export interface SimpleLightProps extends SpotLightProps {
    helper?: boolean;
    targetPosition?: [number, number, number];
}

export function SimpleLight(props: SimpleLightProps) {
    const ref = useRef<THREE.SpotLight>(null!);
    const [refAvailable, setRefAvailable] = useState(false);

    useHelper(props.helper && ref, THREE.SpotLightHelper, "red");

    return (
        <>
            <spotLight
                ref={(nref) => {
                    ref.current = nref as THREE.SpotLight;
                    setRefAvailable(true);
                }}
                {...props}
            />
            {refAvailable && (
                <primitive
                    object={ref.current.target}
                    position={props.targetPosition}
                />
            )}
        </>
    );
}
