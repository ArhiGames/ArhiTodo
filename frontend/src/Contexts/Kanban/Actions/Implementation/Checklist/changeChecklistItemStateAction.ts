import type {ChecklistItem, State} from "../../../../../Models/States/types.ts";
import type {UpdateChecklistItemStateAction} from "../../Action.ts";

const changeChecklistItemStateAction = (state: State, payload: UpdateChecklistItemStateAction) => {

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