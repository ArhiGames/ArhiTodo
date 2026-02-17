import type {Card, State} from "../../Models/States/types.ts";

export type CardMoveIndexByIdResult = {
    oldIndex: number;
    newIndex: number;
    newCardListId: number;
}

const getCardMoveIndexById = (state: State, movedCardId: number,
                              movedToCardId: number): CardMoveIndexByIdResult | undefined => {

    const movedCard: Card | undefined = state.cards.get(movedCardId);
    if (!movedCard) return undefined;

    const movedToCard: Card | undefined = state.cards.get(movedToCardId);
    if (!movedToCard) return undefined;

    const oldIndex: number = Array.from(state.cards.values()).filter(c => c.cardListId === movedCard.cardListId)
        .findIndex(c => c.cardId == movedCardId);
    const newIndex: number = Array.from(state.cards.values()).filter(c => c.cardListId === movedToCard.cardListId)
        .findIndex(c => c.cardId == movedToCardId);

    return { oldIndex, newIndex, newCardListId: movedToCard.cardListId }

}

export default getCardMoveIndexById