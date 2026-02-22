import type {Project, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {InitProjectPayload} from "../../KanbanAction.ts";

const initProjectAction = (state: KanbanState, payload: InitProjectPayload) => {

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