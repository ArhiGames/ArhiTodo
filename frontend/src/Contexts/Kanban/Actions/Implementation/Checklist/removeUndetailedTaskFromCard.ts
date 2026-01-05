import type {State} from "../../../../../Models/States/types.ts";
import type {RemoveUndetailedTaskFromCardPayload} from "../../Action.ts";

const removeUndetailedTaskFromCard = (state: State, payload: RemoveUndetailedTaskFromCardPayload) => {

    return {
        ...state,
        cards: {
            ...state.cards,
            [payload.taskFromCardId]: {
                ...state.cards[payload.taskFromCardId],
                totalTasks: state.cards[payload.taskFromCardId].totalTasks - 1,
            }
        }
    }

}

export default removeUndetailedTaskFromCard;