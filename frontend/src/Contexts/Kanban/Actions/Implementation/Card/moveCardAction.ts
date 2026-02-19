import type {Card, State} from "../../../../../Models/States/types.ts";
import type {MoveCardPayload} from "../../Action.ts";

const moveCardAction = (state: State, payload: MoveCardPayload) => {

    const newCards: Map<number, Card> = new Map(state.cards);

    const movingCard: Card | undefined = state.cards.get(payload.cardId);
    if (!movingCard) return state;

    const destinationCards: Card[] = Array.from(state.cards.values())
        .filter((c: Card) => c.cardListId === payload.toCardListId);

    const changedItems: Card[] = destinationCards.filter((_: Card, index: number) => index >= payload.toIndex);

    changedItems.forEach((card: Card) => newCards.delete(card.cardId));
    newCards.delete(payload.cardId);
    newCards.set(movingCard.cardId, { ...movingCard, cardListId: payload.toCardListId });
    changedItems.forEach((card: Card) => newCards.set(card.cardId, card));

    console.warn(changedItems);

    return {
        ...state,
        cards: newCards
    }

}

export default moveCardAction;