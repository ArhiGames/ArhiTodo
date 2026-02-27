export type DefaultClaim = {
    claimType: string;
    claimName: string;
    claimDescription: string;
}

export const defaultGlobalClaims: DefaultClaim[] = [
    {
        claimType: "CreateProjects",
        claimName: "Create projects",
        claimDescription: "If enabled the user can create projects"
    },
    {
        claimType: "AccessAdminDashboard",
        claimName: "Access admin dashboard",
        claimDescription: "If enabled, the user can access the admin dashboard, but cannot modify anything"
    },
    {
        claimType: "ManageUsers",
        claimName: "Manage users",
        claimDescription: "If enabled, the user can manage users, add them to groups & change their permissions"
    },
    {
        claimType: "DeleteUsers",
        claimName: "Delete users",
        claimDescription: "If enabled, the user can delete other user's accounts"
    },
    {
        claimType: "InviteOtherUsers",
        claimName: "Invite users",
        claimDescription: "If enabled, the user can generate invitation links for other's to use this service"
    },
    {
        claimType: "UpdateAppSettings",
        claimName: "Update app settings",
        claimDescription: "If enabled, the user can change the general app settings"
    },
]

export const defaultBoardClaims: DefaultClaim[] = [
    {
        claimType: "ManageUsers",
        claimName: "Manage users",
        claimDescription: "If enabled the user can add, remove users, additionally the user can change the permissions of users"
    },
    {
        claimType: "ManageBoard",
        claimName: "Manage board",
        claimDescription: "If enabled the user can edit this board, e. g. the board name"
    },
    {
        claimType: "ManageCardLists",
        claimName: "Manage card lists",
        claimDescription: "If enabled the user can create, edit & delete card lists"
    },
    {
        claimType: "ManageCards",
        claimName: "Manage cards",
        claimDescription: "If enabled the user can create, edit & delete cards"
    },
    {
        claimType: "ManageLabels",
        claimName: "Manage labels",
        claimDescription: "If enabled the user can create, edit & delete labels"
    },
]