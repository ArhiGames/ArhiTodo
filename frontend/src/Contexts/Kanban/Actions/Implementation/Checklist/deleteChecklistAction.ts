import type {State} from "../../../../../Models/States/types.ts";
import cleanChecklistAction from "../cleanChecklistAction.ts";

const deleteChecklistAction = (state: State, checklistId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [checklistId]: _, ...restChecklists } = state.checklists;

    const { newChecklistItems } = cleanChecklistAction(state, [checklistId]);

    return {
        ...state,
        checklists: restChecklists,
        checklistItems: newChecklistItems
    }

}

export default deleteChecklistAction;