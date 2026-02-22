import type {ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateChecklistItemStateAction} from "../../KanbanAction.ts";

const changeChecklistItemStateAction = (state: KanbanState, payload: UpdateChecklistItemStateAction) => {

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);
    const existingChecklistItem: ChecklistItem | undefined = state.checklistItems.get(payload.checklistItemId);
    if (!existingChecklistItem) return state;

    newChecklistItems.set(payload.checklistItemId, {
        ...existingChecklistItem,
        isDone: payload.newState
    })

    return {
        ...state,
        checklistItems: newChecklistItems
    }

}

export default changeChecklistItemStateAction;