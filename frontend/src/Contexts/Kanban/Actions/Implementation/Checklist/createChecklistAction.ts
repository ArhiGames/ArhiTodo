import type {State} from "../../../../../Models/States/types.ts";
import type {CreateChecklistPayload} from "../../Action.ts";

const createChecklistAction = (state: State, payload: CreateChecklistPayload) => {

    return {
        ...state,
        checklists: {
            ...state.checklists,
            [payload.checklistId]: {
                checklistId: payload.checklistId,
                checklistName: payload.checklistName,
                cardId: payload.cardId,
            }
        }
    }

}

export default createChecklistAction;