import type {Card, CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateCardPayload} from "../../KanbanAction.ts";

const createCardAction = (state: KanbanState, payload: CreateCardPayload): KanbanState => {

    const existingCardList: CardList | undefined = state.cardLists.get(payload.cardListId);
    if (!existingCardList) return state;

    const newCardLists: Map<number, CardList> = new Map(state.cardLists);
    if (!existingCardList.cardIds.includes(payload.cardId)) {
        newCardLists.set(payload.cardListId, {
            ...existingCardList,
            cardIds: [...existingCardList.cardIds, payload.cardId]
        });
    }

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(payload.cardId, {
        cardId: payload.cardId,
        cardName: payload.cardName,
        cardDescription: "",
        isDone: false,
        cardUrgencyLevel: 0,
        cardListId: payload.cardListId,
        assignedUserIds: []
    });
    const newCardLabels: Map<number, number[]> = new Map(state.cardLabels);
    newCardLabels.set(payload.cardId, []);

    return {
        ...state,
        cardLists: newCardLists,
        cards: newCards,
        cardLabels: newCardLabels
    }

}

export default createCardAction;