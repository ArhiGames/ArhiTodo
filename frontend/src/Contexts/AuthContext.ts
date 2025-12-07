import { createContext } from "react";

export type AuthContextType = {
    userName: string | null;
    token: string | null;
    login: (userName: string, password: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
    userName: null,
    token: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: () => false
})