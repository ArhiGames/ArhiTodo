import type {PublicUserGetDto} from "./States/KanbanState.ts";

export interface InvitationLink {
    invitationLinkId: number;
    invitationLinkName: string;
    invitationKey: string;
    createdDate: string;
    expiresDate: string;
    createdByUser: PublicUserGetDto;
    maxUses: number;
    uses: number;
    isActive: boolean;
}