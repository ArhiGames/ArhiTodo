import type {Checklist, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateChecklistPayload} from "../../KanbanAction.ts";

const createChecklistAction = (state: KanbanState, payload: CreateChecklistPayload) => {

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