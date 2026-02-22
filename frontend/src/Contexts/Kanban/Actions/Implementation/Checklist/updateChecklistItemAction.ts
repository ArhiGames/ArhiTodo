import type {ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateChecklistItemPayload} from "../../KanbanAction.ts";

const updateChecklistItemAction = (state: KanbanState, payload: UpdateChecklistItemPayload) => {

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);
    const existingChecklistItem: ChecklistItem | undefined = state.checklistItems.get(payload.checklistItemId);
    if (!existingChecklistItem) return state;

    newChecklistItems.set(payload.checklistItemId, {
        ...existingChecklistItem,
        checklistItemName: payload.checklistItemName,
        isDone: payload.isDone,
    })

    return {
        ...state,
        checklistItems: newChecklistItems
    }

}

export default updateChecklistItemAction;