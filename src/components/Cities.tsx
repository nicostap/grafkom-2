import { GroupProps } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { LB1 } from "./LB1";
import { LB2 } from "./LB2";
import { LB3 } from "./LB3";
import { LB4 } from "./LB4";

const buildings = [LB1, LB2, LB3, LB4];

export function Cities(props: GroupProps) {
    // Get map (assuming getRandomMap is defined elsewhere)
    const map = useMemo(() => getRandomMap(), []);
    useEffect(() => {
        console.log("Using map:", map);
    }, [map]);

    // Randomly select a building
    const getRandomBuilding = () => {
        const index = Math.floor(Math.random() * buildings.length);
        return buildings[index];
    };

    return (
        <group {...props} dispose={null}>
            {/* Place random buildings in a straight row with 1000 distance */}
            {Array.from({ length: 10 }).map((_, i) => {
                const Building = getRandomBuilding();
                return (
                    <Building
                        key={i}
                        position={[i * 1000, 0, 0]}
                    />
                );
            })}
        </group>
    );
}