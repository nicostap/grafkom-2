import { Bar2 } from "./Bar2";
import { Box } from "./Box";
import { Victim2 } from "./Victim2";

export function BarScene(props: JSX.IntrinsicElements["group"]) {
    return (
        <group {...props}>
            <Bar2 receiveShadow />
            {/* mesh won't appear for some reason */}
            <Victim2
                position={[0, 2, 0]}
                scale={[100, 100, 100]}
                activeAction="Drinking"
            />
        </group>
    );
}
