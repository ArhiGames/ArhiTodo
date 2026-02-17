import type {Project, State} from "../../../../../Models/States/types.ts";
import type {UpdateProjectPayload} from "../../Action.ts";

const updateProjectAction = (state: State, payload: UpdateProjectPayload) => {

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