import type {Card, State} from "../../../../../Models/States/types.ts";
import cleanCardAction from "../cleanCardAction.ts";

const deleteCardAction = (state: State, failedCardId: number) => {

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.delete(failedCardId);

    const { newCardLabels, newChecklists,
        newChecklistItems } = cleanCardAction(state, [failedCardId]);

    return {
        ...state,
        cards: newCards,
        cardLabels: newCardLabels,
        checklists: newChecklists,
        newChecklistItems: newChecklistItems
    }

}

export default deleteCardAction;