import type {Card, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateCardAssignedUsersPayload} from "../../KanbanAction.ts";

const assignCardUserAction = (state: KanbanState, payload: UpdateCardAssignedUsersPayload): KanbanState => {

    const card: Card | undefined = state.cards.get(payload.cardId);
    if (!card) return state;

    if (!card.assignedUserIds.some(asu => asu === payload.assignedUserId)) {
        card.assignedUserIds.push(payload.assignedUserId);
    }

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(payload.cardId, card);

    return {
        ...state,
        cards: newCards
    }

}

export default assignCardUserAction;