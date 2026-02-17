import type {Card, State} from "../../../../../Models/States/types.ts";
import type {UpdateCardStatePayload} from "../../Action.ts";

const updateCardStateAction = (state: State, payload: UpdateCardStatePayload) => {

    const newCards: Map<number, Card> = new Map(state.cards);
    const existingCard: Card | undefined = state.cards.get(payload.cardId);
    if (!existingCard) return state;

    newCards.set(payload.cardId, {
        ...existingCard,
        isDone: payload.newState
    });


    return {
        ...state,
        cards: newCards
    }

}

export default updateCardStateAction;