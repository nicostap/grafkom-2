import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import "./App.css";
import { Bar2 } from "./components/Bar2";
import { Maze } from "./components/Maze";
import { SpectatorControls } from "./components/SpectatorControls";
import { City } from "./components/City";
import { Victim } from "./components/Victim";
import { Clown } from "./components/Clown";
import { SimpleLight } from "./components/SimpleLight";

function App() {
    return (
        <KeyboardControls
            map={[
                { name: "forward", keys: ["ArrowUp", "w"] },
                { name: "backward", keys: ["ArrowDown", "s"] },
                { name: "left", keys: ["ArrowLeft", "a"] },
                { name: "right", keys: ["ArrowRight", "d"] },
                { name: "sprint", keys: ["Shift"] },
            ]}
        >
            <Canvas shadows>
                <Perf />
                <PerspectiveCamera
                    position={[10000 - 200, 200, 300]}
                    rotation={[0, -Math.PI / 4, 0]}
                    fov={75}
                    near={0.1}
                    far={100000}
                    makeDefault
                />
                <SpectatorControls />
                <ambientLight intensity={Math.PI / 8} />
                <Maze receiveShadow position={[0, 0, 0]} />
                {/* Scene 1 - Minum-minum */}
                <Bar2
                    receiveShadow
                    position={[10000, 0, 0]}
                    scale={[60, 60, 60]}
                />
                {/* Scene 2 - Mabok-mabok */}
                <City
                    receiveShadow
                    position={[-10000, 100, 1000]}
                    scale={[600, 600, 600]}
                    rotation={[0, Math.PI / 2, 0]}
                />
                <Victim
                    position={[0, 10, -1000]}
                    scale={[100, 100, 100]}
                    receiveShadow
                    castShadow
                />
            </Canvas>
        </KeyboardControls>
    );
}

export default App;
