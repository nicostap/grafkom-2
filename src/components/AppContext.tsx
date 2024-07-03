import { useState, useContext, createContext } from "react";

interface AppState {
    ongoingCutscene: boolean;
}

interface AppStateContext {
    appState: AppState;
    setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AppContext = createContext<AppStateContext>(null!);

interface AppContextProps {
    children: React.ReactNode;
}

export function AppProvider({ children }: AppContextProps) {
    const [appState, setAppState] = useState<AppState>({
        ongoingCutscene: false,
    });

    return (
        <AppContext.Provider value={{ appState, setAppState }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
