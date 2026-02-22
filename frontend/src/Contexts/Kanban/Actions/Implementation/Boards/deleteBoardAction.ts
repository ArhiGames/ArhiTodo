import type {Board, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanBoardAction from "../cleanBoardAction.ts";

const deleteBoardAction = (state: KanbanState, deleteBoardId: number) => {

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