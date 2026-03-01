import type {Board, CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateCardlistPayload} from "../../KanbanAction.ts";

const createCardlistAction = (state: KanbanState, payload: CreateCardlistPayload) => {

    const board: Board | undefined = state.boards.get(payload.boardId);
    if (!board) return state;

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(payload.boardId, {
        ...board,
        cardListIds: [...board.cardListIds, payload.cardListId]
    })

    const newCardlists: Map<number, CardList> = new Map(state.cardLists);
    newCardlists.set(payload.cardListId, {
        cardListId: payload.cardListId,
        cardListName: payload.cardListName,
        boardId: payload.boardId,
        cardIds: []
    });

    return {
        ...state,
        boards: newBoards,
        cardLists: newCardlists
    }

}

export default createCardlistAction;