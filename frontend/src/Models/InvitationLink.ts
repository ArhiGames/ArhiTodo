export interface InvitationLink {
    invitationLinkId: number;
    invitationLinkName: string;
    invitationKey: string;
    createdDate: string;
    expiresDate: string;
    createdByUser: string;
    maxUses: number;
    uses: number;
    isActive: boolean;
}