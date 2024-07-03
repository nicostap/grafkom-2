import { Canvas, useFrame } from "@react-three/fiber";
import {
    FlyControls,
    KeyboardControls,
    OrbitControls,
    PerspectiveCamera,
} from "@react-three/drei";
import "./App.css";
import { Perf } from "r3f-perf";
import { ModularWall } from "./components/ModularWall";
import { Maze } from "./components/Maze";

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
                    far={100000}
                    makeDefault
                />
                <FlyControls makeDefault movementSpeed={100} />
                <ambientLight intensity={Math.PI} />
                <Maze receiveShadow position={[0, 0, 0]} />
                <OrbitControls />
            </Canvas>
        </KeyboardControls>
    );
}

export default App;
