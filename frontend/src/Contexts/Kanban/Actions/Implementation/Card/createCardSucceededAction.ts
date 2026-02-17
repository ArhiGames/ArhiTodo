import type {Card, State} from "../../../../../Models/States/types.ts";
import type {CreateCardSucceededPayload} from "../../Action.ts";

const createCardSucceededAction = (state: State, payload: CreateCardSucceededPayload) => {

    const newCards: Map<number, Card> = new Map(state.cards);
    const existingCard: Card | undefined = state.cards.get(payload.actualCardId);
    if (!existingCard) return state;

    newCards.set(payload.actualCardId, {
        ...existingCard,
        cardId: payload.actualCardId
    });
    newCards.delete(payload.predictedCardId);

    const newCardLabels: Map<number, number[]> = new Map(state.cardLabels);
    newCardLabels.delete(payload.predictedCardId);

    return {
        ...state,
        cards: newCards,
        cardLabels: newCardLabels
    }

}

export default createCardSucceededAction;