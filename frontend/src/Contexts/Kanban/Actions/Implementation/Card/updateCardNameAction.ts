import type {State} from "../../../../../Models/States/types.ts";
import type {UpdateCardNamePayload} from "../../Action.ts";

const updateCardNameAction = (state: State, payload: UpdateCardNamePayload) => {

    return {
        ...state,
        cards: {
            ...state.cards,
            [payload.cardId]: {
                ...state.cards[payload.cardId],
                cardName: payload.cardName
            }
        }
    }

}

export default updateCardNameAction;