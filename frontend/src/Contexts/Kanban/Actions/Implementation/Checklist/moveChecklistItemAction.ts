import type {Checklist, ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {MoveChecklistItemPayload} from "../../KanbanAction.ts";

const moveChecklistItemAction = (state: KanbanState, payload: MoveChecklistItemPayload): KanbanState => {
    const currentMovingChecklistItem: ChecklistItem | undefined = state.checklistItems.get(payload.checklistItemId);
    if (!currentMovingChecklistItem) return state;

    const oldChecklist: Checklist | undefined = state.checklists.get(currentMovingChecklistItem.checklistId);
    if (!oldChecklist) return state;

    const newChecklist: Checklist | undefined = state.checklists.get(payload.toChecklistId);
    if (!newChecklist) return state;

    const updatedOldChecklistItemIds = [...oldChecklist.checklistItemIds];
    const updatedNewChecklistItemIds =
        oldChecklist === newChecklist
            ? updatedOldChecklistItemIds
            : [...newChecklist.checklistItemIds];

    const removeIndex = updatedOldChecklistItemIds.indexOf(payload.checklistItemId);
    if (removeIndex !== -1) {
        updatedOldChecklistItemIds.splice(removeIndex, 1);
    }

    updatedNewChecklistItemIds.splice(payload.toIndex, 0, payload.checklistItemId);

    const updatedChecklists: Map<number, Checklist> = new Map(state.checklists);
    const updatedChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);

    updatedChecklists.set(oldChecklist.checklistId, {
        ...oldChecklist,
        checklistItemIds: updatedOldChecklistItemIds,
    });

    updatedChecklists.set(newChecklist.checklistId, {
        ...newChecklist,
        checklistItemIds: updatedNewChecklistItemIds,
    });

    updatedChecklistItems.set(payload.checklistItemId, {
        ...currentMovingChecklistItem,
        checklistId: payload.toChecklistId,
    });

    return {
        ...state,
        checklists: updatedChecklists,
        checklistItems: updatedChecklistItems,
    };
}

export default moveChecklistItemAction;