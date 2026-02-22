import type {ChecklistItem, KanbanState} from "../../../../Models/States/KanbanState.ts";

const cleanChecklistAction = (state: KanbanState, checklistIds: number[]) => {

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);

    const itemIdsToDelete = Array.from(state.checklistItems.values())
        .filter(cli => checklistIds.includes(cli.checklistId))
        .map(cli => cli.checklistItemId);

    itemIdsToDelete.forEach(id => newChecklistItems.delete(id));

    return { newChecklistItems }

}

export default cleanChecklistAction;