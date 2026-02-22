import type {Card, CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {MoveCardPayload} from "../../KanbanAction.ts";

const moveCardAction = (state: KanbanState, payload: MoveCardPayload): KanbanState => {

    const currentMovingCard: Card | undefined = state.cards.get(payload.cardId);
    if (!currentMovingCard) return state;

    const oldCardList: CardList | undefined = state.cardLists.get(currentMovingCard.cardListId);
    if (!oldCardList) return state;

    const newCardList: CardList | undefined = state.cardLists.get(payload.toCardListId);
    if (!newCardList) return state;

    const updatedOldCardIds = [...oldCardList.cardIds];
    const updatedNewCardIds =
        oldCardList === newCardList
            ? updatedOldCardIds
            : [...newCardList.cardIds];

    const removeIndex = updatedOldCardIds.indexOf(payload.cardId);
    if (removeIndex !== -1) {
        updatedOldCardIds.splice(removeIndex, 1);
    }

    updatedNewCardIds.splice(payload.toIndex, 0, payload.cardId);

    const updatedCardLists = new Map(state.cardLists);
    const updatedCards = new Map(state.cards);

    updatedCardLists.set(oldCardList.cardListId, {
        ...oldCardList,
        cardIds: updatedOldCardIds,
    });

    updatedCardLists.set(newCardList.cardListId, {
        ...newCardList,
        cardIds: updatedNewCardIds,
    });

    updatedCards.set(payload.cardId, {
        ...currentMovingCard,
        cardListId: payload.toCardListId,
    });

    return {
        ...state,
        cardLists: updatedCardLists,
        cards: updatedCards,
    };

}

export default moveCardAction;