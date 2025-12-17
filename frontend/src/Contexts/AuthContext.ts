import { createContext } from "react";
import type {AppUser} from "../Models/AppUser.ts";

export type AuthContextType = {
    appUser: AppUser | null;
    token: string | null;
    isLoaded: boolean;
    register: (userName: string, email: string, password: string, invitationKey: string) => void;
    login: (userName: string, password: string) => void;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
    appUser: null,
    token: null,
    isLoaded: false,
    register: () => {},
    login: () => {},
    logout: () => {},
    isAuthenticated: () => false
})