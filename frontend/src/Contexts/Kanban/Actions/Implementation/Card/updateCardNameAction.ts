import type {Card, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateCardNamePayload} from "../../KanbanAction.ts";

const updateCardNameAction = (state: KanbanState, payload: UpdateCardNamePayload) => {

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