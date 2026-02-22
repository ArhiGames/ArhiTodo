import type {BoardPermission, ProjectPermission, UserState} from "../../Models/States/UserState.ts";

export const InitialUserState: UserState = {
    projectPermission: new Map<number, ProjectPermission>(),
    boardPermissions: new Map<number, BoardPermission>()
};