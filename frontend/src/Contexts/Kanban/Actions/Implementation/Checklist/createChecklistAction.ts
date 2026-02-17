import type {Checklist, State} from "../../../../../Models/States/types.ts";
import type {CreateChecklistPayload} from "../../Action.ts";

const createChecklistAction = (state: State, payload: CreateChecklistPayload) => {

    const newChecklists: Map<number, Checklist> = new Map(state.checklists);
    newChecklists.set(payload.checklistId, {
        checklistId: payload.checklistId,
        checklistName: payload.checklistName,
        cardId: payload.cardId,
    })

    return {
        ...state,
        checklists: newChecklists
    }

}

export default createChecklistAction;