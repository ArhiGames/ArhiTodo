import type {JwtPayload} from "jwt-decode";

export interface KanbanJwtPayload extends JwtPayload {
    AccessAdminDashboard: string,
    CreateProjects: string,
    DeleteUsers: string,
    InviteOtherUsers: string,
    ManageUsers: string,
    ModifyOthersProjects: string,
    UpdateAppSettings: string,
    nameid: string;
    unique_name: string;
    email: string;
}