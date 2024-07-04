import { useEffect } from "react";
import { useAppContext } from "./AppContext";
import App from "../App";

export function QuickStateToggle() {
    const [appState, setAppState] = useAppContext();

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "\\") {
            setAppState({
                ...appState,
                freecamMode: !appState.freecamMode,
            });
        }
        if (event.key === "1") {
            setAppState({ ...appState, currentScene: 1 });
        }
        if (event.key === "2") {
            setAppState({ ...appState, currentScene: 2 });
        }
        if (event.key === "3") {
            setAppState({ ...appState, currentScene: 3 });
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return null;
}
