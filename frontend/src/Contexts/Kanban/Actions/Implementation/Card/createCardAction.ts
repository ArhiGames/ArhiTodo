import type {Card, State} from "../../../../../Models/States/types.ts";
import type {CreateCardPayload} from "../../Action.ts";

const createCardAction = (state: State, payload: CreateCardPayload): State => {

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(payload.cardId, {
        cardId: payload.cardId,
        cardName: payload.cardName,
        isDone: false,
        cardListId: payload.cardListId,
    });
    const newCardLabels: Map<number, number[]> = new Map(state.cardLabels);
    newCardLabels.set(payload.cardId, []);

    return {
        ...state,
        cards: newCards,
        cardLabels: newCardLabels
    }

}

export default createCardAction;