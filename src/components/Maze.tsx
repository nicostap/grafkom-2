import { GroupProps } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { getRandomMap } from "../lib/maps";
import { ModularWall } from "./ModularWall";
import { FloorTile } from "./FloorTile";
import { SimpleLight } from "./SimpleLight";

export function Maze(props: GroupProps) {
    // Get map
    const map = useMemo(() => getRandomMap(), []);
    useEffect(() => {
        console.log("Using map:", map);
    }, [map]);

    return (
        <group {...props} dispose={null}>
            {map.map((row, i) => (
                <group key={i}>
                    {row.map((cell, j) =>
                        map[i][j] === 0 ? (
                            <ModularWall
                                position={[i * 500 - 500, 250, j * 500 - 500]}
                                scale={[250, 250, 250]}
                                key={j}
                                frustumCulled
                            />
                        ) : map[i][j] === 1 ? (
                            <FloorTile
                                position={[i * 500 - 500, 0, j * 500 - 500]}
                                scale={[250, 250, 250]}
                                key={j}
                                frustumCulled
                            />
                        ) : (
                            <group key={j}>
                                <FloorTile
                                    position={[i * 500 - 500, 0, j * 500 - 500]}
                                    scale={[250, 250, 250]}
                                    frustumCulled
                                />
                                <SimpleLight
                                    position={[
                                        i * 500 - 500,
                                        500,
                                        j * 500 - 500,
                                    ]}
                                    intensity={Math.PI * 2}
                                    // castShadow
                                    decay={0.01}
                                    targetPosition={[
                                        i * 500 - 500,
                                        0,
                                        j * 500 - 500,
                                    ]}
                                    angle={Math.PI / 3}
                                    penumbra={0.75}
                                    color="#CC0000"
                                />
                            </group>
                        )
                    )}
                </group>
            ))}
        </group>
    );
}
