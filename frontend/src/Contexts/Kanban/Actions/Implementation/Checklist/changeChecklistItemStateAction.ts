import type {State} from "../../../../../Models/States/types.ts";
import type {UpdateChecklistItemStateAction} from "../../Action.ts";

const changeChecklistItemStateAction = (state: State, payload: UpdateChecklistItemStateAction) => {

    return {
        ...state,
        checklistItems: {
            ...state.checklistItems,
            [payload.checklistItemId]: {
                ...state.checklistItems[payload.checklistItemId],
                isDone: payload.newState
            }
        }
    }

}

export default changeChecklistItemStateAction;