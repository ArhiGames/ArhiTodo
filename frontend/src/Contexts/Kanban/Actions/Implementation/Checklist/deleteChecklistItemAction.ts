import type {Checklist, ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";

const deleteChecklistItemAction = (state: KanbanState, checklistItemId: number ) => {

    const checklistItem: ChecklistItem | undefined = state.checklistItems.get(checklistItemId);
    if (!checklistItem) return state;

    const checklist: Checklist | undefined = state.checklists.get(checklistItem.checklistId);
    if (!checklist) return state;

    const newChecklists: Map<number, Checklist> = new Map(state.checklists);

    const indexToRemove: number = checklist.checklistItemIds.indexOf(checklistItemId);
    if (indexToRemove !== -1) {
        const newChecklistItemIds: number[] = [...checklist.checklistItemIds];
        newChecklistItemIds.splice(indexToRemove, 1);

        newChecklists.set(checklist.checklistId, {
            ...checklist,
            checklistItemIds: newChecklistItemIds
        });
    }

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);
    newChecklistItems.delete(checklistItemId);

    return {
        ...state,
        checklists: newChecklists,
        checklistItems: newChecklistItems
    }

}

export default deleteChecklistItemAction;