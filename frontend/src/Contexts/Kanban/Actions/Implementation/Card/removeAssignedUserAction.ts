import type {Card, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateCardAssignedUsersPayload} from "../../KanbanAction.ts";

const removeAssignedUserAction = (state: KanbanState, payload: UpdateCardAssignedUsersPayload): KanbanState => {

    const card: Card | undefined = state.cards.get(payload.cardId);
    if (!card) return state;

    const indexToRemove: number = card.assignedUserIds.indexOf(payload.assignedUserId);
    if (indexToRemove !== -1) {
        card.assignedUserIds.splice(indexToRemove, 1);
    }

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(payload.cardId, card);


    return {
        ...state,
        cards: newCards
    }

}

export default removeAssignedUserAction;