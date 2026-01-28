import type {Project, State} from "../../../../../Models/States/types.ts";
import type {InitProjectPayload} from "../../Action.ts";

const initProjectsAction = (state: State, payload: InitProjectPayload[]) => {

    const projects: Record<number, Project> = {};
    for (const initProjectPayload of payload) {
        projects[initProjectPayload.projectId] = {
            projectId: initProjectPayload.projectId,
            projectName: initProjectPayload.projectName,
        }
    }

    return {
        ...state,
        projects: projects
    }

}

export default initProjectsAction;