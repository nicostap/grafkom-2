import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useRef, useState } from "react";
import "./App.css";
import { Bar2 } from "./components/Bar2";
import { City } from "./components/City";
import { Maze } from "./components/Maze";
import { PostProcessing } from "./components/PostProcessing";
import { SpectatorControls } from "./components/SpectatorControls";
import { Victim } from "./components/Victim";
import { SkyBox } from "./components/Skybox";
import { CustsceneController } from "./components/CutsceneController";
import { useAppContext } from "./components/AppContext";
import { QuickStateToggle } from "./components/QuickStateToggle";
import { BarScene } from "./components/BarScene";
import { Player } from "./components/Player";
import { Clown } from "./components/Clown";

function App() {
    const [appState] = useAppContext();

    return (
        <Canvas shadows>
            <QuickStateToggle />
            <SkyBox />
            <fog attach="fog" far={8000} near={3000} color="darkgray" />
            <Suspense fallback={null}>
                <PostProcessing />
            </Suspense>
            <Perf />
            <PerspectiveCamera
                position={[10000 - 200, 250, 300]}
                rotation={[0, -Math.PI / 4, 0]}
                fov={75}
                near={0.1}
                far={10000}
                makeDefault
            />
            <CustsceneController />

            {!appState.ongoingCutscene && appState.freecamMode && (
                <SpectatorControls />
            )}

            <ambientLight intensity={Math.PI / 16} />

            {/* Scene 1 - Minum-minum */}
            {appState.currentScene <= 1 && (
                <BarScene
                    receiveShadow
                    position={[10000, 0, 0]}
                    scale={[60, 60, 60]}
                />
            )}

            {/* Scene 2 - Mabok-mabok */}
            <City
                position={[-10000, 100, 1000]}
                scale={[600, 600, 600]}
                rotation={[0, Math.PI / 2, 0]}
            />

            <Victim
                position={[-9200, 100, -900]}
                scale={[100, 100, 100]}
                rotation={[0, Math.PI, 0]}
                activeAction="DrunkIdle"
            />
        </Canvas>
    );
}

export default App;
