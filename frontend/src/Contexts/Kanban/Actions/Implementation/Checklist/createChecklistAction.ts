import type {Card, Checklist, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateChecklistPayload} from "../../KanbanAction.ts";

const createChecklistAction = (state: KanbanState, payload: CreateChecklistPayload) => {

    const card: Card | undefined = state.cards.get(payload.cardId);
    if (!card) return state;

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(payload.cardId, {
        ...card,
        checklistIds: [...card.checklistIds, payload.checklistId]
    })

    const newChecklists: Map<number, Checklist> = new Map(state.checklists);
    newChecklists.set(payload.checklistId, {
        checklistId: payload.checklistId,
        checklistName: payload.checklistName,
        cardId: payload.cardId,
        checklistItemIds: []
    })

    return {
        ...state,
        cards: newCards,
        checklists: newChecklists
    }

}

export default createChecklistAction;