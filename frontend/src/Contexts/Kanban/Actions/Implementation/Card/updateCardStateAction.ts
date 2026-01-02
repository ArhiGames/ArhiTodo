import type {State} from "../../../../../Models/States/types.ts";
import type {UpdateCardStatePayload} from "../../Action.ts";

const updateCardStateAction = (state: State, payload: UpdateCardStatePayload) => {

    return {
        ...state,
        cards: {
            ...state.cards,
            [payload.cardId]: {
                ...state.cards[payload.cardId],
                isDone: payload.newState
            }
        }
    }

}

export default updateCardStateAction;