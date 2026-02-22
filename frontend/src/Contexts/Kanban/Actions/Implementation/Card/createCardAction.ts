import type {Card, CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateCardPayload} from "../../KanbanAction.ts";

const createCardAction = (state: KanbanState, payload: CreateCardPayload): KanbanState => {

    const cardList: CardList | undefined = state.cardLists.get(payload.cardListId);
    if (!cardList) return state;
    if (!cardList.cardIds.includes(payload.cardId)) {
        cardList.cardIds.push(payload.cardId);
    }

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(payload.cardId, {
        cardId: payload.cardId,
        cardName: payload.cardName,
        cardDescription: "",
        isDone: false,
        cardListId: payload.cardListId,
        assignedUserIds: []
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