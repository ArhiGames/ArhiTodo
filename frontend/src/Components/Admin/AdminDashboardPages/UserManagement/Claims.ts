export type ClaimDatatype = "boolean" | "number" | "string";

export type DefaultClaim = {
    claimType: string;
    claimName: string;
    claimDescription: string;
    claimDatatype: ClaimDatatype; // number vs boolean
}

export type DefaultClaims = {
    claim: DefaultClaim[];
}

export const defaultAppClaims: DefaultClaims = {
    claim: [
        {
            claimType: "create_projects",
            claimName: "Create projects",
            claimDescription: "If enabled the user can create projects where ever he wants",
            claimDatatype: "boolean"
        },
        {
            claimType: "delete_others_boards",
            claimName: "Delete projects",
            claimDescription: "If enabled the user can just delete other's boards without special permissions",
            claimDatatype: "boolean"
        },
        {
            claimType: "modify_others_boards",
            claimName: "Modify projects",
            claimDescription: "If enabled the user has writing permissions for every project & board",
            claimDatatype: "boolean"
        },
        {
            claimType: "access_admin_dashboard",
            claimName: "Access admin dashboard",
            claimDescription: "If enabled, the user can access the admin dashboard, but cannot modify anything",
            claimDatatype: "boolean"
        },
        {
            claimType: "manage_users",
            claimName: "Manage users",
            claimDescription: "If enabled, the user can manage users, add them to groups & change their permissions",
            claimDatatype: "boolean"
        },
        {
            claimType: "delete_users",
            claimName: "Delete users",
            claimDescription: "If enabled, the user can delete other user's accounts",
            claimDatatype: "boolean"
        },
        {
            claimType: "invite_other_users",
            claimName: "Invite users",
            claimDescription: "If enabled, the user can generate invitation links for other's to use this service",
            claimDatatype: "boolean"
        },
        {
            claimType: "update_app_settings",
            claimName: "Update app settings",
            claimDescription: "If enabled, the user can change the general app settings",
            claimDatatype: "boolean"
        }
    ]
}