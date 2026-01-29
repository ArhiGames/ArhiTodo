import type {State} from "../../../../../Models/States/types.ts";

const deleteProjectAction = (state: State, projectId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [projectId]: _, ...restProjects } = state.projects;

    return {
        ...state,
        projects: {
            restProjects
        }
    }

}

export default deleteProjectAction;