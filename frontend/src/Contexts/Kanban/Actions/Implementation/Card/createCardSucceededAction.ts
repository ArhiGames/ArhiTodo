import type {State} from "../../../../../Models/States/types.ts";
import type {CreateCardSucceededPayload} from "../../Action.ts";

const createCardSucceededAction = (state: State, payload: CreateCardSucceededPayload) => {

    const { [payload.predictedCardId]: cardToUpdate, ...restCards } = state.cards;

    return {
        ...state,
        cards: {
            ...restCards,
            [payload.actualCardId]: {
                ...cardToUpdate,
                cardId: payload.actualCardId,
            }
        }
    }

}

export default createCardSucceededAction;