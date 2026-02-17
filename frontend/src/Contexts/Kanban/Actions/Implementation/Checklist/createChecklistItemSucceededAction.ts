import type {ChecklistItem, State} from "../../../../../Models/States/types.ts";
import type {CreateChecklistItemSucceededPayload} from "../../Action.ts";

const createChecklistItemSucceededAction = (state: State, payload: CreateChecklistItemSucceededPayload) => {

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