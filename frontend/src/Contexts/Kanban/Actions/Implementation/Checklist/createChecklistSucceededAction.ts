import type {Checklist, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateChecklistSucceededPayload} from "../../KanbanAction.ts";

const createChecklistSucceededAction = (state: KanbanState, payload: CreateChecklistSucceededPayload) => {

    const newChecklists: Map<number, Checklist> = new Map(state.checklists);
    const existingChecklist: Checklist | undefined = state.checklists.get(payload.predictedChecklistId);
    if (!existingChecklist) return state;

    newChecklists.set(payload.actualChecklistId, {
        ...existingChecklist,
        checklistId: payload.actualChecklistId
    });
    newChecklists.delete(payload.predictedChecklistId);

    return {
        ...state,
        checklists: newChecklists
    }

}

export default createChecklistSucceededAction;