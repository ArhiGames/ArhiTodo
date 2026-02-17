import type {ChecklistItem, State} from "../../../../Models/States/types.ts";

const cleanChecklistAction = (state: State, checklistIds: number[]) => {

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);

    const itemIdsToDelete = Array.from(state.checklistItems.values())
        .filter(cli => checklistIds.includes(cli.checklistId))
        .map(cli => cli.checklistItemId);

    itemIdsToDelete.forEach(id => newChecklistItems.delete(id));

    return { newChecklistItems }

}

export default cleanChecklistAction;