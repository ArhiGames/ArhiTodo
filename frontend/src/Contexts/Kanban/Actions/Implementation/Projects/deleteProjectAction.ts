import type {State} from "../../../../../Models/States/types.ts";
import cleanProjectAction from "../cleanProjectAction.ts";

const deleteProjectAction = (state: State, projectId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [projectId]: _, ...restProjects } = state.projects;

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