import type {Card, CardList, Checklist, ChecklistItem, KanbanState} from "../../../../Models/States/KanbanState.ts";
import cleanChecklistAction from "./cleanChecklistAction.ts";

interface ReturnType {
    newCardLabels: Map<number, number[]>;
    newChecklists: Map<number, Checklist>;
    newChecklistItems: Map<number, ChecklistItem>;
}

const cleanCardAction = (state: KanbanState, cardIds: number[]): ReturnType => {
    for (const cardId of cardIds) {
        const card: Card | undefined = state.cards.get(cardId);
        if (!card) return { newCardLabels: state.cardLabels, newChecklists: state.checklists, newChecklistItems: state.checklistItems };

        const cardList: CardList | undefined = state.cardLists.get(card.cardListId);
        if (!cardList) return { newCardLabels: state.cardLabels, newChecklists: state.checklists, newChecklistItems: state.checklistItems };

        const indexToRemove = cardList.cardIds.indexOf(cardId);
        if (indexToRemove !== -1) {
            cardList.cardIds.splice(indexToRemove, 1);
        }
    }

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