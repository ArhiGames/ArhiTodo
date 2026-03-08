import type {KanbanState, Project} from "../../../../../Models/States/KanbanState.ts";
import type {AddProjectManagerPayload} from "../../KanbanAction.ts";

const addProjectManagerAction = (state: KanbanState, payload: AddProjectManagerPayload): KanbanState => {

    const project: Project | undefined = state.projects.get(payload.projectId);
    if (!project) return state;

    const newProjects: Map<number, Project> = new Map(state.projects);
    newProjects.set(payload.projectId, {
        ...project,
        projectManagers: [...project.projectManagers, payload.projectManager]
    });

    return {
        ...state,
        projects: newProjects
    };

}

export default addProjectManagerAction;