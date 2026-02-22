import type {ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateChecklistItemSucceededPayload} from "../../KanbanAction.ts";

const createChecklistItemSucceededAction = (state: KanbanState, payload: CreateChecklistItemSucceededPayload) => {

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);
    const existingChecklistItem: ChecklistItem | undefined = state.checklistItems.get(payload.predictedChecklistItemId);
    if (!existingChecklistItem) return state;

    newChecklistItems.set(payload.actualChecklistItemId, {
        ...existingChecklistItem,
        checklistItemId: payload.actualChecklistItemId
    });
    newChecklistItems.delete(payload.predictedChecklistItemId);

    return {
        ...state,
        checklistItems: newChecklistItems
    }

}

export default createChecklistItemSucceededAction;