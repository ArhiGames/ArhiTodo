import type {Card, State} from "../../../../../Models/States/types.ts";
import type {UpdateCardAssignedUsersPayload} from "../../Action.ts";

const assignCardUserAction = (state: State, payload: UpdateCardAssignedUsersPayload): State => {

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