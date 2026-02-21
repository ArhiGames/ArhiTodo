import type {Claim} from "../../Claim.ts";
import type {PublicUserGetDto} from "../../States/types.ts";

export interface UserGetDto extends PublicUserGetDto {
    createdAt: string;
    joinedViaInvitationKey: string;
    userClaims: Claim[];
    boardUserClaims: Claim[];
}