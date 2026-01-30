import type {Claim} from "../../Claim.ts";

export type UserGetDto = {
    userId: string;
    createdAt: string;
    userName: string;
    email: string;
    joinedViaInvitationKey: string;
    userClaims: Claim[];
}