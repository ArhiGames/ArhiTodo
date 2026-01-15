import {type ReactNode, useCallback, useEffect, useState} from "react";
import type { JwtPayload } from "../../Models/JwtPayload.ts";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext.ts";
import {loginApi, logoutApi, refreshApi, registerApi} from "../../Services/AuthService.tsx";
import { useNavigate } from "react-router-dom";
import type { AppUser } from "../../Models/AppUser.ts";

let refreshingPromise: Promise<boolean> | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const navigate = useNavigate();
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    const register = async (userName: string, email: string, password: string, invitationKey: string) => {

        const jwt: JwtPayload | null = await registerApi(userName, email, password, invitationKey);

        if (!jwt) return;
        onLoggedIn(jwt);
    }

    const login = async (userName: string, password: string) => {

        const jwt: JwtPayload | null = await loginApi(userName, password);

        if (!jwt) return;
        onLoggedIn(jwt);
    }

    function onLoggedIn(jwt: JwtPayload) {

        setToken(localStorage.getItem("token"));
        setAppUser( { id: jwt.nameid, unique_name: jwt.unique_name, email: jwt.email} );

    }

    const logout = useCallback(async () => {

        try {
            await logoutApi();
        } catch (e) {
            console.error(e);
        }

        setToken(null);
        setAppUser(null);
        navigate("/login");

    }, [navigate])

    const isAuthenticated = () => {
        return !!token;
    }

    const checkRefresh = useCallback(async (): Promise<boolean> => {

        if (refreshingPromise) {
            return refreshingPromise;
        }

        const savedToken = localStorage.getItem("token");
        if (!savedToken) {
            return false;
        }

        const decoded: JwtPayload = jwtDecode(savedToken);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
            setToken(savedToken);
            setAppUser({ id: decoded.nameid, unique_name: decoded.unique_name, email: decoded.email });
            return true;
        }

        refreshingPromise = (async () => {
            try {
                const jwt = await refreshApi();
                if (!jwt) {
                    await logout();
                    return false;
                }
                onLoggedIn(jwt);
                return true;
            } catch (e) {
                console.error(e);
                await logout();
                return false;
            } finally {
                refreshingPromise = null;
            }
        })();

        return refreshingPromise;

    }, [logout])

    useEffect(() => {

        (async () => {

            await checkRefresh();
            setIsLoaded(true);

        })()

    }, [checkRefresh]);

    return (
        <AuthContext.Provider
            value={{
                appUser,
                token,
                isLoaded,
                checkRefresh,
                register,
                login,
                logout,
                isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}