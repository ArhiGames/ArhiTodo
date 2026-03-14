import type {PublicUserGetDto} from "./States/KanbanState.ts";
import type {Claim} from "./Claim.ts";

export interface InvitationLink {
    invitationLinkId: number;
    invitationLinkName: string;
    invitationKey: string;
    createdDate: string;
    expiresDate: string;
    createdByUser: PublicUserGetDto;
    defaultInvitationClaims: Claim[];
    maxUses: number;
    uses: number;
    isActive: boolean;
}