import type {State} from "../../../../../Models/States/types.ts";
import type {CreateChecklistItemSucceededPayload} from "../../Action.ts";

const createChecklistItemSucceededAction = (state: State, payload: CreateChecklistItemSucceededPayload) => {

    const { [payload.predictedChecklistItemId]: checklistItemToUpdate, ...restChecklists } = state.checklistItems;

    return {
        ...state,
        checklistItems: {
            ...restChecklists,
            [payload.actualChecklistItemId]: {
                ...checklistItemToUpdate,
                checklistItemId: payload.actualChecklistItemId,
            }
        }
    }

}

export default createChecklistItemSucceededAction;