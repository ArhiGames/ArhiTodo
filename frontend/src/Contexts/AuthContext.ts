import { createContext } from "react";
import type {AppUser} from "../Models/AppUser.ts";

export type AuthContextType = {
    appUser: AppUser | null;
    token: string | null;
    login: (userName: string, password: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
    appUser: null,
    token: null,
    login: () => {},
    logout: () => {},
    isAuthenticated: () => false
})