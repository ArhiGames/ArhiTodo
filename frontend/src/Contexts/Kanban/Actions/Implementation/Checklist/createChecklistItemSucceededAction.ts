import type {Checklist, ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateChecklistItemSucceededPayload} from "../../KanbanAction.ts";

const createChecklistItemSucceededAction = (state: KanbanState, payload: CreateChecklistItemSucceededPayload) => {

    const checklistItem: ChecklistItem | undefined = state.checklistItems.get(payload.predictedChecklistItemId);
    if (!checklistItem) return state;

    const checklist: Checklist | undefined = state.checklists.get(checklistItem.checklistId);
    if (!checklist) return state;

    const newChecklists: Map<number, Checklist> = new Map(state.checklists);
    newChecklists.set(checklist.checklistId, {
        ...checklist,
        checklistItemIds: checklist.checklistItemIds.map((checklistItemId: number) =>
            checklistItemId === payload.predictedChecklistItemId ? payload.actualChecklistItemId : checklistItemId)
    })

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
        checklists: newChecklists,
        checklistItems: newChecklistItems
    }

}

export default createChecklistItemSucceededAction;