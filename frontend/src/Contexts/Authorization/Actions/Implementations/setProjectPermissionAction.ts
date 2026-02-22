import type {SetProjectPermissionsPayload} from "../userAction.ts";
import type {ProjectPermission, UserState} from "../../../../Models/States/UserState.ts";

const setProjectPermissionAction = (state: UserState, payload: SetProjectPermissionsPayload): UserState => {

    const newProjectPermissions: Map<number, ProjectPermission> = new Map(state.projectPermission);
    newProjectPermissions.set(payload.projectId, {
        projectId: payload.projectId,
        isManager: payload.isManager,
        isProjectOwner: payload.isOwner
    });

    return {
        ...state,
        projectPermission: newProjectPermissions
    }

}

export default setProjectPermissionAction;