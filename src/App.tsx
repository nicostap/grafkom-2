import { KeyboardControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import "./App.css";
import { Bar } from "./components/Bar";
import { Maze } from "./components/Maze";
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
                <ambientLight intensity={Math.PI} />
                <Maze receiveShadow position={[0, 0, 0]} />
                <Bar
                    receiveShadow
                    position={[10000, 0, 0]}
                    scale={[60, 60, 60]}
                />
            </Canvas>
        </KeyboardControls>
    );
}

export default App;
