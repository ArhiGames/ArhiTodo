import type {Project, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {InitProjectPayload} from "../../KanbanAction.ts";

const initProjectsAction = (state: KanbanState, payload: InitProjectPayload[]) => {

    const projects: Map<number, Project> = new Map();
    for (const initProjectPayload of payload) {
        projects.set(initProjectPayload.projectId, {
            projectId: initProjectPayload.projectId,
            projectName: initProjectPayload.projectName,
            ownedByUserId: initProjectPayload.ownedByUserId
        })
    }

    return {
        ...state,
        projects: projects
    }

}

export default initProjectsAction;