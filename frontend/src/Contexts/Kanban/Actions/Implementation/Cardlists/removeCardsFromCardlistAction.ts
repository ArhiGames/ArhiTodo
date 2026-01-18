import type {Card, State} from "../../../../../Models/States/types.ts";

const removeCardsFromCardlistAction = (state: State, fromCardListId: number )=> {

    const remainingCards: Record<number, Card> = [];

    for (const card of Object.values(state.cards)) {
        if (card.cardListId !== fromCardListId) {
            remainingCards[card.cardId] = card;
        }
    }

    return {
        ...state,
        cards: remainingCards
    }

}

export default removeCardsFromCardlistAction;