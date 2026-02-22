import type {Checklist, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateChecklistPayload} from "../../KanbanAction.ts";

const updateChecklistAction = (state: KanbanState, payload: UpdateChecklistPayload) =>  {

    const newChecklists: Map<number, Checklist> = new Map(state.checklists);
    const existingChecklist: Checklist | undefined = state.checklists.get(payload.checklistId);
    if (!existingChecklist) return state;

    newChecklists.set(payload.checklistId, {
        ...existingChecklist,
        checklistName: payload.checklistName
    })

    return {
        ...state,
        checklists: newChecklists
    }

}

export default updateChecklistAction;