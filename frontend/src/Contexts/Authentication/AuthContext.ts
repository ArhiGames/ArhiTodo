import { createContext } from "react";
import type { AppUser } from "../../Models/AppUser.ts";
import type {PasswordAuthorizerResult} from "../../Models/BackendDtos/PasswordAuthorizerResult.ts";

export type AuthContextType = {
    appUser: AppUser | null;
    token: string | null;
    isLoaded: boolean;
    checkRefresh: () => Promise<string | null>;
    register: (userName: string, email: string, password: string, invitationKey: string) => Promise<PasswordAuthorizerResult>;
    login: (userName: string, password: string) => Promise<void>;
    logout: (sendLogoutRequest: boolean) => void;
    isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
    appUser: null,
    token: null,
    isLoaded: false,
    checkRefresh: async () => null,
    register: async () => ({} as PasswordAuthorizerResult),
    login: async () => {},
    logout: () => {},
    isAuthenticated: () => false
})