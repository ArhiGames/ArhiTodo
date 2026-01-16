import type {State} from "../../../../../Models/States/types.ts";
import type {CreateChecklistItemPayload} from "../../Action.ts";

const createChecklistItemAction = (state: State, payload: CreateChecklistItemPayload): State => {

    return {
        ...state,
        checklistItems: {
            ...state.checklistItems,
            [payload.checklistItemId]: {
                checklistItemId: payload.checklistItemId,
                checklistItemName: payload.checklistItemName,
                isDone: false,
                checklistId: payload.checklistId
            }
        }
    }

}

export default createChecklistItemAction;