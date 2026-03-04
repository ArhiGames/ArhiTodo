import type {Checklist, ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateChecklistItemPayload} from "../../KanbanAction.ts";

const createChecklistItemAction = (state: KanbanState, payload: CreateChecklistItemPayload): KanbanState => {

    const existingChecklist: Checklist | undefined = state.checklists.get(payload.checklistId);
    if (!existingChecklist) return state;

    const newChecklists: Map<number, Checklist> = new Map(state.checklists);
    newChecklists.set(payload.checklistId, {
        ...existingChecklist,
        checklistItemIds: [...existingChecklist.checklistItemIds, payload.checklistItemId],
    });

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);
    newChecklistItems.set(payload.checklistItemId, {
        checklistItemId: payload.checklistItemId,
        checklistItemName: payload.checklistItemName,
        isDone: false,
        checklistId: payload.checklistId
    });

    return {
        ...state,
        checklists: newChecklists,
        checklistItems: newChecklistItems
    }

}

export default createChecklistItemAction;