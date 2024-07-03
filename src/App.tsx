import { Canvas, useFrame } from "@react-three/fiber";
import {
    FlyControls,
    KeyboardControls,
    OrbitControls,
    PerspectiveCamera,
    PointerLockControls,
    useHelper,
} from "@react-three/drei";
import "./App.css";
import { Perf } from "r3f-perf";
import { ModularWall } from "./components/ModularWall";
import { Maze } from "./components/Maze";
import { Bar } from "./components/Bar";
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
                    position={[0, 0, 5]}
                    fov={75}
                    near={0.1}
                    far={100000}
                    makeDefault
                />
                <SpectatorControls />
                <PointerLockControls />
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
