import type {Card, State} from "../../../../../Models/States/types.ts";
import type {UpdateCardAssignedUsersPayload} from "../../Action.ts";

const removeAssignedUserAction = (state: State, payload: UpdateCardAssignedUsersPayload): State => {

    const card: Card | undefined = state.cards.get(payload.cardId);
    if (!card) return state;

    const indexToRemove: number = card.assignedUserIds.indexOf(payload.assignedUserId);
    if (indexToRemove === -1) return state;
    card.assignedUserIds.splice(indexToRemove, 1);

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(payload.cardId, card);


    return {
        ...state,
        cards: newCards
    }

}

export default removeAssignedUserAction;