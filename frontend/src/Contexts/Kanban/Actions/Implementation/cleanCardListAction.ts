import type {Card, State} from "../../../../Models/States/types.ts";
import cleanCardAction from "./cleanCardAction.ts";

const cleanCardListAction = (state: State, cardListIds: number[]) => {
    const newCards: Record<number, Card> = state.cards;

    const cardIdsToDelete = Object.values(state.cards)
        .filter(c => cardListIds.includes(c.cardListId))
        .map(c => c.cardId);
    
    const { newCardLabels, newChecklists, newChecklistItems } = cleanCardAction(state, cardIdsToDelete);

    cardIdsToDelete.forEach(id => delete newCards[id]);

    return { newCards: newCards, newCardLabels: newCardLabels, newChecklists: newChecklists, newChecklistItems: newChecklistItems };
}

export default cleanCardListAction;