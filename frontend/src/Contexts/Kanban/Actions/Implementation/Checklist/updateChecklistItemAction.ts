import type {ChecklistItem, State} from "../../../../../Models/States/types.ts";
import type {UpdateChecklistItemPayload} from "../../Action.ts";

const updateChecklistItemAction = (state: State, payload: UpdateChecklistItemPayload) => {

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