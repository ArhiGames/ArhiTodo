import type {Card, CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateCardSucceededPayload} from "../../KanbanAction.ts";

const createCardSucceededAction = (state: KanbanState, payload: CreateCardSucceededPayload): KanbanState => {
    const { actualCardId, predictedCardId } = payload;

    const existingCard: Card | undefined = state.cards.get(predictedCardId);
    if (!existingCard) return state;

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.delete(predictedCardId);
    newCards.set(actualCardId, {
        ...existingCard,
        cardId: actualCardId
    });

    const existingCardList = state.cardLists.get(existingCard.cardListId);
    if (!existingCardList) return state;

    const newCardLists: Map<number, CardList> = new Map(state.cardLists);
    newCardLists.set(existingCard.cardListId, {
        ...existingCardList,
        cardIds: existingCardList.cardIds.map(id => id === predictedCardId ? actualCardId : id)
    });

    const newCardLabels: Map<number, number[]> = new Map(state.cardLabels);
    const labels: number[] | undefined = newCardLabels.get(predictedCardId);
    if (labels) {
        newCardLabels.delete(predictedCardId);
        newCardLabels.set(actualCardId, labels);
    }

    return {
        ...state,
        cards: newCards,
        cardLists: newCardLists,
        cardLabels: newCardLabels
    };
};

export default createCardSucceededAction;