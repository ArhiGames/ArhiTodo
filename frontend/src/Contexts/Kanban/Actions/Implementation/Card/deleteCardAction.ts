import type {Card, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanCardAction from "../cleanCardAction.ts";

const deleteCardAction = (state: KanbanState, failedCardId: number) => {

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