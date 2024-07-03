import { Bar2 } from "./Bar2";
import { Box } from "./Box";
import { Victim } from "./Victim";

export function BarScene(props: JSX.IntrinsicElements["group"]) {
    return (
        <group {...props}>
            <Bar2 receiveShadow />
            {/* mesh won't appear for some reason */}
            {/* <Victim
                position={[0, 2, 0]}
                scale={[3, 3, 3]}
                activeAction="DrunkWalking"
            /> */}
        </group>
    );
}
