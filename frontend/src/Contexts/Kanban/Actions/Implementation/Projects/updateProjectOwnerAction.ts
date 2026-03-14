import type {KanbanState, Project} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateProjectOwnerPayload} from "../../KanbanAction.ts";

const updateProjectOwnerAction = (state: KanbanState, payload: UpdateProjectOwnerPayload): KanbanState => {

    const project: Project | undefined = state.projects.get(payload.projectId);
    if (!project) return state;

    const newProjects: Map<number, Project> = new Map(state.projects);
    newProjects.set(payload.projectId, {
        ...project,
        ownedByUserId: payload.userId,
    })

    return {
        ...state,
        projects: newProjects,
    }

}

export default updateProjectOwnerAction;