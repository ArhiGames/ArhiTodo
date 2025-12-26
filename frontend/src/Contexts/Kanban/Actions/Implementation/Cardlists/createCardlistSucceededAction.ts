import type {State} from "../../../../../Models/States/types.ts";
import type {CreateCardlistSucceededPayload} from "../../Action.ts";

const createCardlistSucceededAction = (state: State, payload: CreateCardlistSucceededPayload) => {

    const { [payload.predictedCardlistId]: cardListToUpdate, ...restCardLists } = state.cardLists;

    return {
        ...state,
        cardLists: {
            ...restCardLists,
            [payload.actualCardlistId]: {
                ...cardListToUpdate,
                cardListId: payload.actualCardlistId,
            }
        }
    }

}

export default createCardlistSucceededAction;