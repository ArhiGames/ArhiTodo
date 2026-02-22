import type {Card, CardList, KanbanState} from "../../Models/States/KanbanState.ts";

export type CardMoveIndexByIdResult = {
    newIndex: number;
    newCardListId: number;
}

function extractId(stringId: string): number {
    return Number(stringId.slice(stringId.indexOf("-") + 1));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCardMoveIndex = (state: KanbanState, target: any, ): CardMoveIndexByIdResult | undefined => {

    const movedToCard: Card | undefined = state.cards.get(extractId(target.id));
    if (!movedToCard) return undefined;

    return { newIndex: target.data.index, newCardListId: movedToCard.cardListId }

}

const getCardOnCardListMoveIndexById = (state: KanbanState, movedToCardListId: number): CardMoveIndexByIdResult | undefined => {

    const movedToCardList: CardList | undefined = state.cardLists.get(movedToCardListId);
    if (!movedToCardList) return undefined;

    const newIndex: number = Array.from(state.cards.values()).filter(c => c.cardListId === movedToCardListId).length;
    return { newIndex: newIndex, newCardListId: movedToCardListId };

}

export { extractId, getCardMoveIndex, getCardOnCardListMoveIndexById };