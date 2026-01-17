import type {State} from "../../../../../Models/States/types.ts";
import type {UpdateChecklistPayload} from "../../Action.ts";

const updateChecklistAction = (state: State, payload: UpdateChecklistPayload) =>  {

    return {
        ...state,
        checklists: {
            ...state.checklists,
            [payload.checklistId]: {
                ...state.checklists[payload.checklistId],
                checklistName: payload.checklistName,
            }
        }
    }

}

export default updateChecklistAction;