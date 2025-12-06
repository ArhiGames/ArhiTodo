import {createContext, type ReactNode, useEffect, useState} from "react";
import type {JwtPayload} from "../Models/JwtPayload.ts";
import {jwtDecode} from "jwt-decode";

type AuthContextType = {
    userName: string | null;
    token: string | null;
    login: (token: string | null) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    userName: null,
    token: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: false
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {

        (async () => {
            const savedToken = localStorage.getItem("token");
            if (!savedToken) return;

            const decoded: JwtPayload = jwtDecode(savedToken);
            const now = Date.now() / 1000;
            if (decoded.exp > now) {
                setToken(savedToken);
                setUserName(decoded.unique_name);
            } else {
                localStorage.removeItem("token");
            }
        })()

    }, []);

    const login = (newToken: string | null) => {

        if (!newToken) return;
        const decoded: JwtPayload = jwtDecode(newToken);
        setToken(newToken);
        setUserName(decoded.unique_name);
        localStorage.setItem("token", newToken);

    }

    const logout = () => {

        setToken(null);
        setUserName(null);
        localStorage.removeItem("token");

    }

    return (
        <AuthContext.Provider
            value={{token, userName, login, logout, isAuthenticated: !!token}}>
            {children}
        </AuthContext.Provider>
    )
}