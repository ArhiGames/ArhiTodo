import type {Card, State} from "../../../../../Models/States/types.ts";
import type {UpdateCardDescriptionPayload} from "../../Action.ts";

const updateCardDescriptionAction = (state: State, payload: UpdateCardDescriptionPayload): State => {

    const newCards: Map<number, Card> = new Map(state.cards);
    const existingCard: Card | undefined = state.cards.get(payload.cardId);
    if (!existingCard) return state;

    newCards.set(payload.cardId, {
        ...existingCard,
        cardDescription: payload.description
    });

    return {
        ...state,
        cards: newCards
    }

}

export default updateCardDescriptionAction;