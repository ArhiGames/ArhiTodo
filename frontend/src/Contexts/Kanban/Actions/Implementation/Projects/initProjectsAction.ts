import type {Project, State} from "../../../../../Models/States/types.ts";
import type {InitProjectPayload} from "../../Action.ts";

const initProjectsAction = (state: State, payload: InitProjectPayload[]) => {

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