import type {State} from "../../../../../Models/States/types.ts";
import type {CreateChecklistSucceededPayload} from "../../Action.ts";

const createChecklistSucceededAction = (state: State, payload: CreateChecklistSucceededPayload) => {

    const { [payload.predictedChecklistId]: checklistToUpdate, ...restChecklists } = state.checklists;

    return {
        ...state,
        checklists: {
            ...restChecklists,
            [payload.actualChecklistId]: {
                ...checklistToUpdate,
                checklistId: payload.actualChecklistId
            }
        }
    }

}

export default createChecklistSucceededAction;