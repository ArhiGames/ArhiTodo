export type DefaultClaim = {
    claimType: string;
    claimName: string;
    claimDescription: string;
}

export type DefaultClaims = {
    claim: DefaultClaim[];
}

export const defaultAppClaims: DefaultClaims = {
    claim: [
        {
            claimType: "create_projects",
            claimName: "Create projects",
            claimDescription: "If enabled the user can create projects where ever he wants"
        },
        {
            claimType: "delete_others_boards",
            claimName: "Delete projects",
            claimDescription: "If enabled the user can just delete other's boards without special permissions"
        },
        {
            claimType: "modify_others_boards",
            claimName: "Modify projects",
            claimDescription: "If enabled the user has writing permissions for every project & board"
        },
        {
            claimType: "access_admin_dashboard",
            claimName: "Access admin dashboard",
            claimDescription: "If enabled, the user can access the admin dashboard, but cannot modify anything"
        },
        {
            claimType: "manage_users",
            claimName: "Manage users",
            claimDescription: "If enabled, the user can manage users, add them to groups & change their permissions"
        },
        {
            claimType: "delete_users",
            claimName: "Delete users",
            claimDescription: "If enabled, the user can delete other user's accounts"
        },
        {
            claimType: "invite_other_users",
            claimName: "Invite users",
            claimDescription: "If enabled, the user can generate invitation links for other's to use this service"
        },
        {
            claimType: "update_app_settings",
            claimName: "Update app settings",
            claimDescription: "If enabled, the user can change the general app settings"
        }
    ]
}