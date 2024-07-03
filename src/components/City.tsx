import { GroupProps } from "@react-three/fiber";
import { useMemo } from "react";
import { LB1 } from "./LB1";
import { LB2 } from "./LB2";
import { LB3 } from "./LB3";
import { LB4 } from "./LB4";
import { CityBase } from "./CityBase";

const buildings = [LB1, LB2, LB3, LB4];

export function City(props: GroupProps) {
    // Randomly select a building
    const getRandomBuilding = () => {
        const index = Math.floor(Math.random() * buildings.length);
        return buildings[index];
    };

    // Each row should have 20 buildings
    const buildingsPerRow = 20;
    const distanceBetweenBuildings = 2;
    const rowDistance = 4;

    const leftRow = useMemo(
        () =>
            Array.from({ length: buildingsPerRow }).map((_, i) =>
                getRandomBuilding()
            ),
        []
    );
    const rightRow = useMemo(
        () =>
            Array.from({ length: buildingsPerRow }).map((_, i) =>
                getRandomBuilding()
            ),
        []
    );

    return (
        <group {...props}>
            {/* Place random buildings in a straight row with 1000 distance */}
            <group position={[0, 0, -rowDistance / 2]}>
                {leftRow.map((Building, i) => (
                    <Building
                        key={i}
                        position={[i * distanceBetweenBuildings, 0, 0]}
                    />
                ))}
                <CityBase
                    position={[
                        ((leftRow.length - 1) * distanceBetweenBuildings) / 2,
                        -0.05,
                        0,
                    ]}
                    scale={[
                        (leftRow.length + 1) * distanceBetweenBuildings,
                        0.1,
                        2,
                    ]}
                />
            </group>
            <group position={[0, 0, rowDistance / 2]}>
                {rightRow.map((Building, i) => (
                    <Building
                        key={i}
                        position={[i * distanceBetweenBuildings, 0, 0]}
                    />
                ))}
                <CityBase
                    position={[
                        ((rightRow.length - 1) * distanceBetweenBuildings) / 2,
                        -0.05,
                        0,
                    ]}
                    scale={[
                        (rightRow.length + 1) * distanceBetweenBuildings,
                        0.1,
                        2,
                    ]}
                />
            </group>
        </group>
    );
}
