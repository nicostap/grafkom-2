import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import "./App.css";
import { Bar } from "./components/Bar";
import { Maze } from "./components/Maze";
import { LB1 } from "./components/LB1";
import { LB2 } from "./components/LB2";
import { LB3 } from "./components/LB3";
import { LB4 } from "./components/LB4";
import { SpectatorControls } from "./components/SpectatorControls";

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
                    position={[0, 0, 0]}
                    fov={75}
                    near={0.1}
                    far={100000}
                    makeDefault
                />
                <SpectatorControls />
                <ambientLight intensity={Math.PI / 2} />
                <Maze receiveShadow position={[0, 0, 0]} />
                {/* Scene 1 - Minum-minum */}
                <Bar
                    receiveShadow
                    position={[10000, 0, 0]}
                    scale={[60, 60, 60]}
                />
                {/* Scene 2 - Mabok-mabok */}
                <LB1
                    receiveShadow
                    position={[-10000, 100, 1000]}
                    scale={[600, 600, 600]}
                    rotation={[0, Math.PI / 2, 0]}
                />
                <LB2
                    receiveShadow
                    position={[-10000, 100, 2000]}
                    scale={[600, 600, 600]}
                    rotation={[0, Math.PI / 2, 0]}
                />
                <LB3
                    receiveShadow
                    position={[-10000, 100, 3000]}
                    scale={[600, 600, 600]}
                    rotation={[0, Math.PI / 2, 0]}
                />
                <LB4
                    receiveShadow
                    position={[-10000, 100, 4500]}
                    scale={[600, 600, 600]}
                    rotation={[0, Math.PI / 2, 0]}
                />
            </Canvas>
        </KeyboardControls>
    );
}

export default App;
