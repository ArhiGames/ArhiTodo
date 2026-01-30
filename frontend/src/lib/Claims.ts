export type DefaultClaim = {
    claimType: string;
    claimName: string;
    claimDescription: string;
}

export const defaultGlobalClaims: DefaultClaim[] = [
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
    },
]

export const defaultBoardClaims: DefaultClaim[] = [
    {
        claimType: "manage_users",
        claimName: "Manage users",
        claimDescription: "If enabled the user can add, remove users, additionally the user can change the permissions of users"
    },
    {
        claimType: "manage_board",
        claimName: "Manage board",
        claimDescription: "If enabled the user can edit & delete this board"
    },
    {
        claimType: "manage_cardlists",
        claimName: "Manage card lists",
        claimDescription: "If enabled the user can create, edit & delete card lists"
    },
    {
        claimType: "manage_cards",
        claimName: "Manage cards",
        claimDescription: "If enabled the user can create, edit & delete cards"
    },
    {
        claimType: "manage_labels",
        claimName: "Manage labels",
        claimDescription: "If enabled the user can create, edit & delete labels"
    },
]