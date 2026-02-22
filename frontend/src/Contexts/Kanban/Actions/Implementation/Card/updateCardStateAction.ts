import type {Card, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateCardStatePayload} from "../../KanbanAction.ts";

const updateCardStateAction = (state: KanbanState, payload: UpdateCardStatePayload) => {

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