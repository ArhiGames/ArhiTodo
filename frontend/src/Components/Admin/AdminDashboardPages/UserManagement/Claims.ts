export type ClaimDatatype = "boolean" | "number" | "string";

export type DefaultClaim = {
    claimType: string;
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
            claimDescription: "If enabled the user can create projects where ever he wants",
            claimDatatype: "boolean"
        },
        {
            claimType: "delete_others_boards",
            claimDescription: "If enabled the user can just delete other's boards without special permissions",
            claimDatatype: "boolean"
        },
        {
            claimType: "modify_others_boards",
            claimDescription: "If enabled the user has writing permissions for every project & board",
            claimDatatype: "boolean"
        },
        {
            claimType: "access_admin_dashboard",
            claimDescription: "If enabled, the user can access the admin dashboard, but cannot modify anything",
            claimDatatype: "boolean"
        },
        {
            claimType: "manage_users",
            claimDescription: "If enabled, the user can manage users, add them to groups & change their permissions",
            claimDatatype: "boolean"
        },
        {
            claimType: "delete_users",
            claimDescription: "If enabled, the user can delete other user's accounts",
            claimDatatype: "boolean"
        },
        {
            claimType: "invite_other_users",
            claimDescription: "If enabled, the user can generate invitation links for other's to use this service",
            claimDatatype: "boolean"
        },
        {
            claimType: "update_app_settings",
            claimDescription: "If enabled, the user can change the general app settings",
            claimDatatype: "boolean"
        }
    ]
}