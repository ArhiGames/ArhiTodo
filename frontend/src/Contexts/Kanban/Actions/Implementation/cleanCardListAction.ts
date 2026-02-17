import type {Card, State} from "../../../../Models/States/types.ts";
import cleanCardAction from "./cleanCardAction.ts";

const cleanCardListAction = (state: State, cardListIds: number[]) => {
    const newCards: Map<number, Card> = new Map(state.cards);

    const cardIdsToDelete = Array.from(state.cards.values())
        .filter(c => cardListIds.includes(c.cardListId))
        .map(c => c.cardId);
    
    const { newCardLabels, newChecklists, newChecklistItems } = cleanCardAction(state, cardIdsToDelete);

    cardIdsToDelete.forEach(id => newCards.delete(id));

    return { newCards: newCards, newCardLabels: newCardLabels, newChecklists: newChecklists, newChecklistItems: newChecklistItems };
}

export default cleanCardListAction;