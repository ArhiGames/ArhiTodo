import type {Board, CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {MoveCardListPayload} from "../../KanbanAction.ts";

const moveCardListAction = (state: KanbanState, payload: MoveCardListPayload): KanbanState => {

    const existingCardList: CardList | undefined = Array.from(state.cardLists.values()).find(c => c.cardListId === payload.cardListId);
    if (!existingCardList) return state;

    const existingBoard: Board | undefined = Array.from(state.boards.values()).find(b => b.boardId === existingCardList.boardId);
    if (!existingBoard) return state;

    const updatedCardListIds: number[] = [...existingBoard.cardListIds];
    const removeIndex: number = existingBoard.cardListIds.indexOf(payload.cardListId);
    if (removeIndex !== -1) {
        updatedCardListIds.splice(removeIndex, 1);
    }

    updatedCardListIds.splice(payload.toIndex, 0, payload.cardListId);

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(existingBoard.boardId, {
        ...existingBoard,
        cardListIds: updatedCardListIds
    })

    return {
        ...state,
        boards: newBoards,
    }

}

export default moveCardListAction;