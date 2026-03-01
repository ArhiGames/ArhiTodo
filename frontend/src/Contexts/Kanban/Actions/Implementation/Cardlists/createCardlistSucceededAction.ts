import type {Board, CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateCardlistSucceededPayload} from "../../KanbanAction.ts";

const createCardlistSucceededAction = (state: KanbanState, payload: CreateCardlistSucceededPayload) => {

    const existingCardList: CardList | undefined = state.cardLists.get(payload.predictedCardlistId);
    if (!existingCardList) return state;

    const existingBoard: Board | undefined = state.boards.get(existingCardList.boardId);
    if (!existingBoard) return state;

    const newBoards: Map<number, Board> = new Map(state.boards);
    const newCardlists: Map<number, CardList> = new Map(state.cardLists);

    newCardlists.set(payload.actualCardlistId, {
        ...existingCardList,
        cardListId: payload.actualCardlistId
    });
    newCardlists.delete(payload.predictedCardlistId);

    newBoards.set(existingBoard.boardId, {
        ...existingBoard,
        cardListIds: existingBoard.cardListIds.map(id => id === payload.predictedCardlistId ? payload.actualCardlistId : id)
    });

    return {
        ...state,
        boards: newBoards,
        cardLists: newCardlists
    }

}

export default createCardlistSucceededAction;