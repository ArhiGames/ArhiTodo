import type {State} from "../../../../../Models/States/types.ts";
import type {CreateCardPayload} from "../../Action.ts";

const createCardAction = (state: State, payload: CreateCardPayload): State => {

    return {
        ...state,
        cards: {
            ...state.cards,
            [payload.cardId]: {
                cardId: payload.cardId,
                cardName: payload.cardName,
                isDone: false,
                cardListId: payload.cardListId,
            }
        },
        cardLabels: {
            ...state.cardLabels,
            [payload.cardId]: []
        }
    }

}

export default createCardAction;