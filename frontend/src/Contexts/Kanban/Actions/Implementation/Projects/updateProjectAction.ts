import type {State} from "../../../../../Models/States/types.ts";
import type {UpdateProjectPayload} from "../../Action.ts";

const updateProjectAction = (state: State, payload: UpdateProjectPayload) => {

    return {
        ...state,
        projects: {
            ...state.projects,
            [payload.projectId]: {
                ...state.projects[payload.projectId],
                projectName: payload.projectName
            }
        }
    }

}

export default updateProjectAction;