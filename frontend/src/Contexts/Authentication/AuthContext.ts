import { createContext } from "react";
import type { AppUser } from "../../Models/AppUser.ts";
import type { Error } from "../../Models/BackendDtos/Auth/Error.ts"
import type {JwtPayload} from "../../Models/JwtPayload.ts";

export type AuthContextType = {
    appUser: AppUser | null;
    token: string | null;
    jwtPayload: JwtPayload | null;
    isLoaded: boolean;
    checkRefresh: () => Promise<string | null>;
    register: (userName: string, email: string, password: string, invitationKey: string) => Promise<Error | null>;
    login: (userName: string, password: string) => Promise<void>;
    logout: (sendLogoutRequest: boolean) => void;
    isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
    appUser: null,
    token: null,
    jwtPayload: null,
    isLoaded: false,
    checkRefresh: async () => null,
    register: async () => ({} as Error),
    login: async () => {},
    logout: () => {},
    isAuthenticated: () => false
})