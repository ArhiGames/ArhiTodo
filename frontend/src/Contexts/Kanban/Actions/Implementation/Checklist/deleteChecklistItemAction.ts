import type {ChecklistItem, State} from "../../../../../Models/States/types.ts";

const deleteChecklistItemAction = ( state: State, payload: { checklistItemId: number } ) => {

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);
    newChecklistItems.delete(payload.checklistItemId);

    return {
        ...state,
        checklistItems: newChecklistItems
    }

}

export default deleteChecklistItemAction;