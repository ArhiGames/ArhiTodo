import type {ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";

const deleteChecklistItemAction = (state: KanbanState, payload: { checklistItemId: number } ) => {

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);
    newChecklistItems.delete(payload.checklistItemId);

    return {
        ...state,
        checklistItems: newChecklistItems
    }

}

export default deleteChecklistItemAction;