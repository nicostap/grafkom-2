import { useState, useContext, createContext } from "react";

interface AppState {
    ongoingCutscene: boolean;
    freecamMode: boolean;
    currentScene: number;
}

const AppContext = createContext<
    [AppState, React.Dispatch<React.SetStateAction<AppState>>]
>(null!);

interface AppContextProps {
    children: React.ReactNode;
}

export function AppProvider({ children }: AppContextProps) {
    const state = useState<AppState>({
        ongoingCutscene: false,
        freecamMode: false,
        currentScene: 1,
    });

    return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    return useContext(AppContext);
}
