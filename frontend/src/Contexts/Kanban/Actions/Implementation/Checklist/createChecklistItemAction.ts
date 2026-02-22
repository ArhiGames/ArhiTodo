import type {ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateChecklistItemPayload} from "../../KanbanAction.ts";

const createChecklistItemAction = (state: KanbanState, payload: CreateChecklistItemPayload): KanbanState => {

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