import type {Card, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateCardUrgencyPayload} from "../../KanbanAction.ts";

const updateCardUrgencyLevelAction = (state: KanbanState, payload: UpdateCardUrgencyPayload) => {

    const card: Card | undefined = state.cards.get(payload.cardId);
    if (!card) return state;

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(payload.cardId, {
        ...card,
        cardUrgencyLevel: payload.newUrgencyLevel
    });

    return {
        ...state,
        cards: newCards
    }

}

export default updateCardUrgencyLevelAction;