import type {State} from "../../../../../Models/States/types.ts";
import cleanBoardAction from "../cleanBoardAction.ts";

const deleteBoardAction = (state: State, deleteBoardId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [deleteBoardId]: _, ...newBoards } = state.boards;

    const { newCardLists, newCards, newLabels, newCardLabels, newChecklists, newChecklistItems } = cleanBoardAction(state, [deleteBoardId]);

    return {
        ...state,
        labels: newLabels,
        boards: newBoards,
        cardLists: newCardLists,
        cards: newCards,
        checklists: newChecklists,
        checklistItems: newChecklistItems,
        cardLabels: newCardLabels
    }

}

export default deleteBoardAction;