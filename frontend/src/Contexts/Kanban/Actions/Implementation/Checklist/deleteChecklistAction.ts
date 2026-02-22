import type {Checklist, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanChecklistAction from "../cleanChecklistAction.ts";

const deleteChecklistAction = (state: KanbanState, checklistId: number) => {

    const restChecklists: Map<number, Checklist> = new Map(state.checklists);
    restChecklists.delete(checklistId);

    const { newChecklistItems } = cleanChecklistAction(state, [checklistId]);

    return {
        ...state,
        checklists: restChecklists,
        checklistItems: newChecklistItems
    }

}

export default deleteChecklistAction;