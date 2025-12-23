import type {State} from "../../../../Models/States/types.ts";
import type {CreateCardlistSucceededPayload} from "../Action.ts";

const createCardlistSucceededAction = (state: State, payload: CreateCardlistSucceededPayload) => {

    return {
        ...state,
        cardLists: {
            ...state.cardLists,
            [payload.predictedCardlistId]: {
                ...state.cardLists[payload.predictedCardlistId],
                cardListId: payload.actualCardlistId,
            }
        }
    }

}

export default createCardlistSucceededAction;