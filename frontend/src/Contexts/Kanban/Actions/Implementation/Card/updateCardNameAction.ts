import type {Card, State} from "../../../../../Models/States/types.ts";
import type {UpdateCardNamePayload} from "../../Action.ts";

const updateCardNameAction = (state: State, payload: UpdateCardNamePayload) => {

    const newCards: Map<number, Card> = new Map(state.cards);
    const existingCard: Card | undefined = state.cards.get(payload.cardId);
    if (!existingCard) return state;

    newCards.set(payload.cardId, {
        ...existingCard,
        cardName: payload.cardName
    });

    return {
        ...state,
        cards: newCards
    }

}

export default updateCardNameAction;