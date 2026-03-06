import type {Board, CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanCardListAction from "../cleanCardListAction.ts";

const deleteCardlistAction = (state: KanbanState, cardListId: number) => {

    const cardList: CardList | undefined = state.cardLists.get(cardListId);
    if (!cardList) return state;

    const board: Board | undefined = state.boards.get(cardList.boardId);
    if (!board) return state;

    const newBoards: Map<number, Board> = new Map(state.boards);

    const indexToRemove: number = board.cardListIds.indexOf(cardListId);
    if (indexToRemove !== -1) {
        const newCardListIds: number[] = [...board.cardListIds];
        newCardListIds.splice(indexToRemove, 1);

        newBoards.set(board.boardId, {
            ...board,
            cardListIds: newCardListIds,
        })
    }

    const newCardlists: Map<number, CardList> = new Map(state.cardLists);
    newCardlists.delete(cardListId);

    const { newCards, newCardLabels,
        newChecklists, newChecklistItems } = cleanCardListAction(state, [cardListId]);

    return {
        ...state,
        boards: newBoards,
        cardLists: newCardlists,
        cards: newCards,
        cardLabels: newCardLabels,
        checklists: newChecklists,
        checklistItems: newChecklistItems
    }
}

export default deleteCardlistAction;