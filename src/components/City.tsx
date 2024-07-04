import { GroupProps } from "@react-three/fiber";
import { useMemo } from "react";
import { LB1 } from "./LB1";
import { LB2 } from "./LB2";
import { LB3 } from "./LB3";
import { LB4 } from "./LB4";
import { CityBase } from "./CityBase";
import { Street } from "./Street";
import { LampuJalan } from "./LampuJalan";
import { SimpleLight } from "./SimpleLight";
import * as THREE from "three";

const buildings = [LB1, LB2, LB3, LB4];

export function City(props: GroupProps) {
    // Randomly select a building
    const getRandomBuilding = () => {
        const index = Math.floor(Math.random() * buildings.length);
        return buildings[index];
    };

    // Each row should have 20 buildings
    const buildingsPerRow = 10;
    const streetLightsPerRow = 15;
    const roadsPerRow = 31;
    const distanceBetweenRoads = 1.425;
    const distanceBetweenStreetLights = 1.5;
    const distanceBetweenBuildings = 2;
    const rowDistance = 4.5;

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
            <group position={[-1.25, 0, 0]}>
                {Array.from({ length: streetLightsPerRow }).map((_, i) => (
                    <group
                        position={[i * distanceBetweenStreetLights, 0, 0]}
                        key={i}
                    >
                        <group position={[0, 0, -1.1]}>
                            <LampuJalan
                                position={[0, 0, 0]}
                                scale={[0.05, 0.05, 0.05]}
                                rotation={[0, Math.PI / 2, 0]}
                            />
                            <SimpleLight
                                position={[0, 0.7, 0.1]}
                                intensity={Math.PI}
                                decay={0.2}
                                targetPosition={[0, -2, 1.5]}
                                angle={Math.PI / 3}
                                penumbra={0.75}
                                color={new THREE.Color(0xffb84c)}
                                // helper
                            />
                        </group>
                        <group position={[0, 0, 1.1]}>
                            <LampuJalan
                                position={[0, 0, 0]}
                                scale={[0.05, 0.05, 0.05]}
                                rotation={[0, -Math.PI / 2, 0]}
                            />
                            <SimpleLight
                                position={[0, 0.7, -0.1]}
                                intensity={Math.PI}
                                decay={0.2}
                                targetPosition={[0, -2, -1.5]}
                                angle={Math.PI / 3}
                                penumbra={0.75}
                                color={new THREE.Color(0xffb84c)}
                                // helper
                            />
                        </group>
                    </group>
                ))}
            </group>

            <group position={[-1.75, 0, -0.625]}>
                {Array.from({ length: roadsPerRow }).map((_, i) => (
                    <Street
                        key={i}
                        position={[(i * distanceBetweenRoads) / 2, 0, 0]}
                        scale={[0.0525, 0.05, 0.05]}
                        rotation={[0, Math.PI / 2, 0]}
                    />
                ))}
            </group>

            <group position={[-1.75, 0, 0.625]}>
                {Array.from({ length: roadsPerRow }).map((_, i) => (
                    <Street
                        key={i}
                        position={[(i * distanceBetweenRoads) / 2, 0, 0]}
                        scale={[0.0525, 0.05, 0.05]}
                        rotation={[0, Math.PI / 2, 0]}
                    />
                ))}
            </group>

            {/* Place random buildings in a straight row with 1000 distance */}
            <group position={[0, 0, -rowDistance / 2]}>
                {leftRow.map((Building, i) => (
                    <Building
                        key={i}
                        position={[i * distanceBetweenBuildings, 0, 0]}
                    />
                ))}
            </group>

            <group>
                <group position={[0, 0, -rowDistance / 2]}>
                    <CityBase
                        position={[
                            ((leftRow.length - 1) * distanceBetweenBuildings) /
                                2,
                            -0.05,
                            0,
                        ]}
                        scale={[
                            (leftRow.length + 1) * distanceBetweenBuildings,
                            0.1,
                            2.5,
                        ]}
                    />
                </group>

                <group position={[0, 0, -rowDistance / 2]}>
                    <CityBase
                        position={[
                            ((leftRow.length - 1) * distanceBetweenBuildings) /
                                2,
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

                <group position={[0, 0, 0]}>
                    <CityBase
                        position={[
                            ((leftRow.length - 1) * distanceBetweenBuildings) /
                                2,
                            -0.05,
                            0,
                        ]}
                        scale={[
                            (leftRow.length + 1) * distanceBetweenBuildings,
                            0.1,
                            0.5,
                        ]}
                    />
                </group>

                <group position={[0, 0, rowDistance / 2]}>
                    <CityBase
                        position={[
                            ((rightRow.length - 1) * distanceBetweenBuildings) /
                                2,
                            -0.05,
                            0,
                        ]}
                        scale={[
                            (rightRow.length + 1) * distanceBetweenBuildings,
                            0.1,
                            2.5,
                        ]}
                    />
                </group>
            </group>

            <group position={[0, 0, rowDistance / 2]}>
                {rightRow.map((Building, i) => (
                    <Building
                        key={i}
                        position={[i * distanceBetweenBuildings, 0, 0]}
                    />
                ))}
            </group>
        </group>
    );
}
