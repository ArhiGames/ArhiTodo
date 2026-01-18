import type {State} from "../../../../../Models/States/types.ts";
import type {UpdateCardlistPayload} from "../../Action.ts";

const updateCardlistAction = (state: State, payload: UpdateCardlistPayload) => {

    return {
        ...state,
        cardLists: {
            ...state.cardLists,
            [payload.cardListId]: {
                ...state.cardLists[payload.cardListId],
                cardListName: payload.cardListName
            }
        }
    }

}

export default updateCardlistAction;