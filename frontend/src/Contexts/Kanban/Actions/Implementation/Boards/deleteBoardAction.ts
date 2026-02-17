import type {Board, State} from "../../../../../Models/States/types.ts";
import cleanBoardAction from "../cleanBoardAction.ts";

const deleteBoardAction = (state: State, deleteBoardId: number) => {

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.delete(deleteBoardId);

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