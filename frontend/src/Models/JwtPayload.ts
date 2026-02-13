export type JwtPayload = {
    AccessAdminDashboard: "true",
    CreateProjects: "true",
    DeleteUsers: "true",
    InviteOtherUsers: "true",
    ManageUsers: "true",
    ModifyOthersProjects: "true",
    UpdateAppSettings: "true",
    nameid: string;
    unique_name: string;
    email: string;
    nbf: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
}