import type {CardList, State} from "../../../../../Models/States/types.ts";
import type {CreateCardlistPayload} from "../../Action.ts";

const createCardlistAction = (state: State, payload: CreateCardlistPayload) => {

    const newCardlists: Map<number, CardList> = new Map(state.cardLists);
    newCardlists.set(payload.cardListId, {
        cardListId: payload.cardListId,
        cardListName: payload.cardListName,
        boardId: payload.boardId
    });

    return {
        ...state,
        cardLists: newCardlists
    }

}

export default createCardlistAction;