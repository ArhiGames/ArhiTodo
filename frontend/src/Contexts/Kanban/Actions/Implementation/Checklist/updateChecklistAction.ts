import type {Checklist, State} from "../../../../../Models/States/types.ts";
import type {UpdateChecklistPayload} from "../../Action.ts";

const updateChecklistAction = (state: State, payload: UpdateChecklistPayload) =>  {

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