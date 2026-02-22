import type {Project, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateProjectPayload} from "../../KanbanAction.ts";

const updateProjectAction = (state: KanbanState, payload: UpdateProjectPayload) => {

    const newProjects: Map<number, Project> = new Map();

    const editingProject: Project | undefined = newProjects.get(payload.projectId);
    if (!editingProject) return state;

    newProjects.set(payload.projectId, {
        ...editingProject,
        projectName: payload.projectName
    })

    return {
        ...state,
        projects: newProjects
    }

}

export default updateProjectAction;