import type {Project, State} from "../../../../../Models/States/types.ts";
import type {InitProjectPayload} from "../../Action.ts";

const initProjectAction = (state: State, payload: InitProjectPayload) => {

    const newProjects: Map<number, Project> = new Map();
    newProjects.set(payload.projectId, {
        projectId: payload.projectId,
        projectName: payload.projectName,
        ownedByUserId: payload.ownedByUserId
    })

    return {
        ...state,
        projects: newProjects
    }

}

export default initProjectAction;