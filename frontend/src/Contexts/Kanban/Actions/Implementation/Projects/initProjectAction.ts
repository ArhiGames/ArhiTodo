import type {State} from "../../../../../Models/States/types.ts";
import type {InitProjectPayload} from "../../Action.ts";

const initProjectAction = (state: State, payload: InitProjectPayload) => {

    return {
        ...state,
        projects: {
            ...state.projects,
            [payload.projectId]: {
                projectId: payload.projectId,
                projectName: payload.projectName,
            }
        }
    }

}

export default initProjectAction;