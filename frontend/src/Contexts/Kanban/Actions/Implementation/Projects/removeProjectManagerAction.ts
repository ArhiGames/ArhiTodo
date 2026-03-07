import type {KanbanState, Project, PublicUserGetDto} from "../../../../../Models/States/KanbanState.ts";
import type {RemoveProjectManagerPayload} from "../../KanbanAction.ts";

const removeProjectManagerAction = (state: KanbanState, payload: RemoveProjectManagerPayload): KanbanState => {

    const project: Project | undefined = state.projects.get(payload.projectId);
    if (!project) return state;

    const newProjectManagers: PublicUserGetDto[] = project.projectManagers;
    const indexToRemove: number = newProjectManagers.findIndex((projectManager: PublicUserGetDto) => projectManager.userId === payload.projectManagerId);
    if (indexToRemove !== -1) {
        newProjectManagers.splice(indexToRemove, 1);
    }

    const newProjects: Map<number, Project> = new Map(state.projects);
    newProjects.set(payload.projectId, {
        ...project,
        projectManagers: newProjectManagers,
    })

    return {
        ...state,
        projects: newProjects,
    }
}

export default removeProjectManagerAction;