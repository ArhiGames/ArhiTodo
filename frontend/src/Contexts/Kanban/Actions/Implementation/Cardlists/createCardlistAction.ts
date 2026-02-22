import type {CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateCardlistPayload} from "../../KanbanAction.ts";

const createCardlistAction = (state: KanbanState, payload: CreateCardlistPayload) => {

    const newCardlists: Map<number, CardList> = new Map(state.cardLists);
    newCardlists.set(payload.cardListId, {
        cardListId: payload.cardListId,
        cardListName: payload.cardListName,
        boardId: payload.boardId,
        cardIds: []
    });

    return {
        ...state,
        cardLists: newCardlists
    }

}

export default createCardlistAction;