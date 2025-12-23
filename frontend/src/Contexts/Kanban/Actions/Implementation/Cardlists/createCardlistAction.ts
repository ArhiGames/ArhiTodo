import type {State} from "../../../../../Models/States/types.ts";
import type {CreateCardlistPayload} from "../../Action.ts";

const createCardlistAction = (state: State, payload: CreateCardlistPayload) => {

    return {
        ...state,
        cardLists: {
            ...state.cardLists,
            [payload.cardListId]: {
                cardListId: payload.cardListId,
                cardListName: payload.cardListName,
                boardId: payload.boardId
            }
        }
    }

}

export default createCardlistAction;