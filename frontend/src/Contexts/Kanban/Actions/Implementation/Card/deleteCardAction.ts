import type {Card, CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanCardAction from "../cleanCardAction.ts";

const deleteCardAction = (state: KanbanState, failedCardId: number) => {

    const card: Card | undefined = state.cards.get(failedCardId);
    if (!card) return state;

    const cardList: CardList | undefined = state.cardLists.get(card.cardListId);
    if (!cardList) return state;

    const newCardLists: Map<number, CardList> = new Map(state.cardLists);

    const indexToRemove: number = cardList.cardIds.indexOf(failedCardId);
    if (indexToRemove !== -1) {
        const newCardIds: number[] = [...cardList.cardIds];
        newCardIds.splice(indexToRemove, 1);

        newCardLists.set(cardList.cardListId, {
            ...cardList,
            cardIds: newCardIds,
        })
    }

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.delete(failedCardId);

    const { newCardLabels, newChecklists,
        newChecklistItems } = cleanCardAction(state, [failedCardId]);

    return {
        ...state,
        cardLists: newCardLists,
        cards: newCards,
        cardLabels: newCardLabels,
        checklists: newChecklists,
        newChecklistItems: newChecklistItems
    }

}

export default deleteCardAction;