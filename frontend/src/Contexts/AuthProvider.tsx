import { type ReactNode, useEffect, useState } from "react";
import type { JwtPayload } from "../Models/JwtPayload.ts";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext.ts";
import { loginApi } from "../Services/AuthService.tsx";
import { useNavigate } from "react-router-dom";
import type { AppUser } from "../Models/AppUser.ts";

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate();
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {

        (async () => {

            setIsLoaded(true);

            const savedToken = localStorage.getItem("token");
            if (!savedToken) return;

            const decoded: JwtPayload = jwtDecode(savedToken);
            const now = Date.now() / 1000;
            if (decoded.exp > now) {
                setToken(savedToken);
                setAppUser( { id: decoded.sub, unique_name: decoded.unique_name, email: decoded.email} );
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
        setAppUser( { id: jwt.sub, unique_name: jwt.unique_name, email: jwt.email} );

    }

    const logout = () => {

        setToken(null);
        setAppUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");

    }

    const isAuthenticated = () => {
        return !!token;
    }

    return (
        <AuthContext.Provider
            value={{
                appUser,
                token,
                isLoaded,
                login,
                logout,
                isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}