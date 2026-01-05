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
                totalTasks: 0,
                totalTasksCompleted: 0,
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