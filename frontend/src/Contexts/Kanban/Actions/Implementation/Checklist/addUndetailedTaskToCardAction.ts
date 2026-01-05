import type {State} from "../../../../../Models/States/types.ts";
import type {AddUndetailedTaskToCardPayload} from "../../Action.ts";

const addUndetailedTaskToCardAction = (state: State, payload: AddUndetailedTaskToCardPayload) => {

    return {
        ...state,
        cards: {
            ...state.cards,
            [payload.taskToCardId]: {
                ...state.cards[payload.taskToCardId],
                totalTasks: state.cards[payload.taskToCardId].totalTasks + 1
            }
        }
    }

}

export default addUndetailedTaskToCardAction;