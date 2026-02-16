import type {ChecklistItem, State} from "../../../../Models/States/types.ts";

const cleanChecklistAction = (state: State, checklistIds: number[]) => {

    const newChecklistItems: Record<number, ChecklistItem> = state.checklistItems;

    const itemIdsToDelete = Object.values(state.checklistItems)
        .filter(cli => checklistIds.includes(cli.checklistId))
        .map(cli => cli.checklistItemId);

    itemIdsToDelete.forEach(id => delete newChecklistItems[id]);

    return { newChecklistItems }

}

export default cleanChecklistAction;