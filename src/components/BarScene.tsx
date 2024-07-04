import { Bar2 } from "./Bar2";
import { Box } from "./Box";
import { Victim1 } from "./Victim1";

export function BarScene(props: JSX.IntrinsicElements["group"]) {
    return (
        <group {...props}>
            <Bar2 receiveShadow />
            {/* mesh won't appear for some reason */}
            <Victim1
                position={[6.5, 0.5, -1]}
                rotation={[0, Math.PI + Math.PI / 4, 0]}
                scale={[2.5, 2.5, 2.5]}
                activeAction="Drinking"
            />
        </group>
    );
}
