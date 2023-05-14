import { createContext, ReactNode, useState } from "react";

export type AuthenticationData = {
        token: [string | null, (token: string | null) => void],
}

export const AuthenticationContext = createContext<AuthenticationData> ({} as AuthenticationData);

export interface AuthenticationContextProviderProps {
        children?: ReactNode,
}

const AuthenticationContextProvider = ({ children }: AuthenticationContextProviderProps ) => {
        const [token, setToken] = useState<string | null> ( null );

        return (
                <AuthenticationContext.Provider value={{
                        token: [token, setToken], 
                }}>
                        { children }
                </AuthenticationContext.Provider>
        )
}

export default AuthenticationContextProvider;