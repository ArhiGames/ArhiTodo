import type {State} from "../../../../../Models/States/types.ts";
import type {UpdateChecklistItemPayload} from "../../Action.ts";

const updateChecklistItemAction = (state: State, payload: UpdateChecklistItemPayload) => {

    return {
        ...state,
        checklistItems: {
            ...state.checklistItems,
            [payload.checklistItemId]: {
                ...state.checklistItems[payload.checklistItemId],
                checklistItemName: payload.checklistItemName,
                isDone: payload.isDone,
            }
        }
    }

}

export default updateChecklistItemAction;