import type {Project, State} from "../../../../../Models/States/types.ts";
import cleanProjectAction from "../cleanProjectAction.ts";

const deleteProjectAction = (state: State, projectId: number) => {

    const restProjects: Map<number, Project> = new Map(state.projects);
    restProjects.delete(projectId);

    const { newBoards, newCardLists, newCards, newLabels, newCardLabels, newChecklists, newChecklistItems } =
        cleanProjectAction(state, projectId);

    return {
        ...state,
        projects: restProjects,
        boards: newBoards,
        cardLists: newCardLists,
        cards: newCards,
        labels: newLabels,
        CardLabels: newCardLabels,
        checklists: newChecklists,
        checklistItems: newChecklistItems,
    }

}

export default deleteProjectAction;