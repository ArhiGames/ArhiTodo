import type {KanbanState, Project} from "../../../../../Models/States/KanbanState.ts";
import type {InitProjectManagersPayload} from "../../KanbanAction.ts";

const initProjectManagersAction = (state: KanbanState, payload: InitProjectManagersPayload): KanbanState => {

    const project: Project | undefined = state.projects.get(payload.projectId);
    if (!project) return state;

    const newProjects: Map<number, Project> = new Map(state.projects);
    newProjects.set(payload.projectId, {
        ...project,
        projectManagers: payload.projectManagers
    });

    return {
        ...state,
        projects: newProjects
    }

}

export default initProjectManagersAction;