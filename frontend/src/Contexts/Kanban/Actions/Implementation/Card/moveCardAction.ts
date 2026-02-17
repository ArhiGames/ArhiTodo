import type {Card, State} from "../../../../../Models/States/types.ts";
import type {MoveCardPayload} from "../../Action.ts";

const moveCardAction = (state: State, payload: MoveCardPayload) => {

    const newCards: Map<number, Card> = new Map(state.cards);

    const movingCard: Card | undefined = state.cards.get(payload.cardId);
    if (!movingCard) return state;

    const affectedCards: Card[] = [];
    for (const card of state.cards.values()) {
        if (card.cardListId === payload.toCardListId) {
            affectedCards.push(card);
        }
    }

    const changedItems: Card[] = [];
    let i: number = 0;
    for (const affectedCard of affectedCards) {
        if (payload.toIndex === 0 || i > payload.toIndex) {
            changedItems.push(affectedCard);
        }
        i++;
    }

    changedItems.forEach((card: Card) => newCards.delete(card.cardId));
    newCards.delete(payload.cardId);
    newCards.set(movingCard.cardId, { ...movingCard, cardListId: payload.toCardListId });
    changedItems.forEach((card: Card) => newCards.set(card.cardId, card));

    return {
        ...state,
        cards: newCards
    }

}

export default moveCardAction;