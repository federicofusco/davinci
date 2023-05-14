import { createContext, useState, ReactNode } from "react";

export type UITheme = "light" | "dark";

export type UIData = {
        keypress: [boolean, (active: boolean) => void],
        theme: [UITheme, (theme: UITheme) => void],
}

export const UIContext = createContext<UIData> ({} as UIData);

export interface UIContextProviderProps {
        children?: ReactNode,
}

const UIContextProvider = ({ children }: UIContextProviderProps ) => {
        const [keypressListeners, setKeypressListeners] = useState<boolean> ( true );
        const [theme, setTheme] = useState<UITheme> ( "dark" );

        return (
                <UIContext.Provider value={{ keypress: [keypressListeners, setKeypressListeners], theme: [theme, setTheme] }}>
                        <main className={`${theme} overflow-x-hidden`}>
                                { children }
                        </main>
               </UIContext.Provider>
        )
}

export default UIContextProvider;