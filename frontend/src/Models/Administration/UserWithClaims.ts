import type { Claim } from "../Claim.ts";

export interface UserWithClaims {
    userId: string;
    userName: string;
    email: string;
    userClaims: Claim[];
}