import type {State} from "../../../../../Models/States/types.ts";
import type {CreateCardPayload} from "../../Action.ts";

const createCardAction = (state: State, payload: CreateCardPayload) => {

    return {
        ...state,
        cards: {
            ...state.cards,
            [payload.cardId]: {
                cardListId: payload.cardListId,
                isDone: false,
                cardId: payload.cardId,
                cardName: payload.cardName
            }
        },
        cardLabels: {
            ...state.cardLabels,
            [payload.cardId]: []
        }
    }

}

export default createCardAction;