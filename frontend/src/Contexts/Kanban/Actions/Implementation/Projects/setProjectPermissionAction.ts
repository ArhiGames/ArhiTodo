import type {State} from "../../../../../Models/States/types.ts";
import type {SetProjectPermissionsPayload} from "../../Action.ts";

const setProjectPermissionAction = (state: State, payload: SetProjectPermissionsPayload): State => {

    return {
        ...state,
        projectPermission: {
            ...state.projectPermission,
            [payload.projectId]: {
                projectId: payload.projectId,
                isManager: payload.isManager
            }
        }
    }

}

export default setProjectPermissionAction;