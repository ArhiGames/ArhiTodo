import type {State} from "../../../../../Models/States/types.ts";
import type {ChangeTaskStatePayload} from "../../Action.ts";

const changeUndetailedTaskStateAction = (state: State, payload: ChangeTaskStatePayload) => {

    return {
        ...state,
        cards: {
            ...state.cards,
            [payload.cardId]: {
                ...state.cards[payload.cardId],
                totalTasksCompleted: state.cards[payload.cardId].totalTasksCompleted + (payload.newState ? 1 : -1),
            }
        }
    }

}

export default changeUndetailedTaskStateAction;