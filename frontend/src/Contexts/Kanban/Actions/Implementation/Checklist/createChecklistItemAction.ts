import type {ChecklistItem, State} from "../../../../../Models/States/types.ts";
import type {CreateChecklistItemPayload} from "../../Action.ts";

const createChecklistItemAction = (state: State, payload: CreateChecklistItemPayload): State => {

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);
    newChecklistItems.set(payload.checklistItemId, {
        checklistItemId: payload.checklistItemId,
        checklistItemName: payload.checklistItemName,
        isDone: false,
        checklistId: payload.checklistId
    });

    return {
        ...state,
        checklistItems: newChecklistItems
    }

}

export default createChecklistItemAction;