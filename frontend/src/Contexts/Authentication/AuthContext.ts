import { createContext } from "react";
import type { AppUser } from "../../Models/AppUser.ts";

export type AuthContextType = {
    appUser: AppUser | null;
    token: string | null;
    isLoaded: boolean;
    checkRefresh: () => Promise<boolean>;
    register: (userName: string, email: string, password: string, invitationKey: string) => Promise<void>;
    login: (userName: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
    appUser: null,
    token: null,
    isLoaded: false,
    checkRefresh: async () => false,
    register: async () => {},
    login: async () => {},
    logout: () => {},
    isAuthenticated: () => false
})