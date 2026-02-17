import type {Checklist, State} from "../../../../Models/States/types.ts";
import cleanChecklistAction from "./cleanChecklistAction.ts";

const cleanCardAction = (state: State, cardIds: number[]) => {
    const newCardLabels: Map<number, number[]> = new Map(state.cardLabels);
    const newChecklists: Map<number, Checklist> = new Map(state.checklists);

    const checklistIdsToDelete = Array.from(state.checklists.values())
        .filter(cl => cardIds.includes(cl.cardId))
        .map(cl => cl.checklistId);

    const cardLabelIdsToDelete = Array.from(state.cardLabels.values())
        .filter(cardId => cardIds.includes(Number(cardId)))
        .map(cardId => Number(cardId));

    const { newChecklistItems } = cleanChecklistAction(state, checklistIdsToDelete);

    cardLabelIdsToDelete.forEach(id => newCardLabels.delete(id));
    checklistIdsToDelete.forEach(id => newChecklists.delete(id));

    return { newCardLabels: newCardLabels, newChecklists: newChecklists, newChecklistItems: newChecklistItems };
}

export default cleanCardAction;