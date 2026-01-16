import type {State} from "../../../../../Models/States/types.ts";

const deleteChecklistItemAction = ( state: State, payload: { checklistItemId: number } ) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [payload.checklistItemId]: _, ...restChecklistItems } = state.checklistItems;

    return {
        ...state,
        checklistItems: {
            ...restChecklistItems
        }
    }

}

export default deleteChecklistItemAction;