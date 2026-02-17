import type {ProjectPermission, State} from "../../../../../Models/States/types.ts";
import type {SetProjectPermissionsPayload} from "../../Action.ts";

const setProjectPermissionAction = (state: State, payload: SetProjectPermissionsPayload): State => {

    const newProjectPermissions: Map<number, ProjectPermission> = new Map(state.projectPermission);
    newProjectPermissions.set(payload.projectId, {
        projectId: payload.projectId,
        isManager: payload.isManager
    });

    return {
        ...state,
        projectPermission: newProjectPermissions
    }

}

export default setProjectPermissionAction;