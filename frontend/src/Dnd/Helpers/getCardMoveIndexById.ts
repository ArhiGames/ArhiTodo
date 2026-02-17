import type {Card, CardList, State} from "../../Models/States/types.ts";

export type CardMoveIndexByIdResult = {
    newIndex: number;
    newCardListId: number;
}

const getCardOnCardMoveIndexById = (state: State, movedToCardId: number): CardMoveIndexByIdResult | undefined => {

    const movedToCard: Card | undefined = state.cards.get(movedToCardId);
    if (!movedToCard) return undefined;

    const newIndex: number = Array.from(state.cards.values()).filter(c => c.cardListId === movedToCard.cardListId)
        .findIndex(c => c.cardId == movedToCardId);

    return { newIndex, newCardListId: movedToCard.cardListId }

}

const getCardOnCardListMoveIndexById = (state: State, movedToCardListId: number): CardMoveIndexByIdResult | undefined => {

    const movedToCardList: CardList | undefined = state.cardLists.get(movedToCardListId);
    if (!movedToCardList) return undefined;

    const newIndex: number = Array.from(state.cards.values()).filter(c => c.cardListId === movedToCardListId).length;
    return { newIndex, newCardListId: movedToCardListId };

}

export { getCardOnCardMoveIndexById, getCardOnCardListMoveIndexById };