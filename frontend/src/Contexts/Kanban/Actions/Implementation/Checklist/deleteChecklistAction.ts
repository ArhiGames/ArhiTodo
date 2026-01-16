import type {State} from "../../../../../Models/States/types.ts";

const deleteChecklistAction = (state: State, payload: { checklistId: number }) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [payload.checklistId]: _, ...restChecklists } = state.checklists;

    return {
        ...state,
        checklists: restChecklists
    }

}

export default deleteChecklistAction;