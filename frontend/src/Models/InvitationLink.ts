export interface InvitationLink {
    invitationLinkId: number;
    invitationKey: string;
    createdDate: string;
    expiresDate: string;
    createdByUser: string;
    maxUses: number;
    uses: number;
    isActive: boolean;
}