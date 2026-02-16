import type {Checklist, State} from "../../../../Models/States/types.ts";
import cleanChecklistAction from "./cleanChecklistAction.ts";

const cleanCardAction = (state: State, cardIds: number[]) => {
    const newCardLabels: Record<number, number[]> = state.cardLabels;
    const newChecklists: Record<number, Checklist> = state.checklists;

    const checklistIdsToDelete = Object.values(state.checklists)
        .filter(cl => cardIds.includes(cl.cardId))
        .map(cl => cl.checklistId);

    const cardLabelIdsToDelete = Object.keys(state.cardLabels)
        .filter(cardId => cardIds.includes(Number(cardId)))
        .map(cardId => Number(cardId));

    const { newChecklistItems } = cleanChecklistAction(state, checklistIdsToDelete);

    cardLabelIdsToDelete.forEach(id => delete newCardLabels[id]);
    checklistIdsToDelete.forEach(id => delete newChecklists[id]);

    return { newCardLabels: newCardLabels, newChecklists: newChecklists, newChecklistItems: newChecklistItems };
}

export default cleanCardAction;