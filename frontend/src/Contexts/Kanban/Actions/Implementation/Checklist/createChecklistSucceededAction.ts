import type {Card, Checklist, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateChecklistSucceededPayload} from "../../KanbanAction.ts";

const createChecklistSucceededAction = (state: KanbanState, payload: CreateChecklistSucceededPayload) => {

    const existingChecklist: Checklist | undefined = state.checklists.get(payload.predictedChecklistId);
    if (!existingChecklist) return state;

    const card: Card | undefined = state.cards.get(existingChecklist.cardId);
    if (!card) return state;

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(card.cardId, {
        ...card,
        checklistIds: card.checklistIds.map((checklistId: number) => checklistId === payload.predictedChecklistId ? payload.actualChecklistId : checklistId)
    });

    const newChecklists: Map<number, Checklist> = new Map(state.checklists);

    newChecklists.set(payload.actualChecklistId, {
        ...existingChecklist,
        checklistId: payload.actualChecklistId
    });
    newChecklists.delete(payload.predictedChecklistId);

    return {
        ...state,
        cards: newCards,
        checklists: newChecklists
    }

}

export default createChecklistSucceededAction;