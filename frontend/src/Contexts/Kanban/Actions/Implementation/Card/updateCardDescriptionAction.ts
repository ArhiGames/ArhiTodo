import type {Card, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateCardDescriptionPayload} from "../../KanbanAction.ts";

const updateCardDescriptionAction = (state: KanbanState, payload: UpdateCardDescriptionPayload): KanbanState => {

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