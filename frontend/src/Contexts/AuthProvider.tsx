import { type ReactNode, useEffect, useState } from "react";
import type {JwtPayload} from "../Models/JwtPayload.ts";
import { jwtDecode } from "jwt-decode";
import { AuthContext} from "./AuthContext.ts";
import { loginApi } from "../Services/AuthService.tsx";
import {useNavigate} from "react-router-dom";


export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate();
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

    const login = async (userName: string, password: string) => {

        const jwt: JwtPayload | null = await loginApi(userName, password);

        if (!jwt) return;

        const userObj = {
            userName: jwt.unique_name,
            email: jwt.email,
        }

        localStorage.setItem("user", JSON.stringify(userObj));
        setToken(localStorage.getItem("token"));
        setUserName(jwt.unique_name);

    }

    const logout = () => {

        setToken(null);
        setUserName(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");

    }

    const isAuthenticated = () => {
        return !!token;
    }

    return (
        <AuthContext.Provider
            value={{token, userName, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}