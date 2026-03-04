import type {Card, Checklist, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {MoveChecklistPayload} from "../../KanbanAction.ts";

const moveChecklistAction = (state: KanbanState, payload: MoveChecklistPayload): KanbanState => {

    const existingChecklist: Checklist | undefined = Array.from(state.checklists.values()).find(c => c.checklistId === payload.checklistId);
    if (!existingChecklist) return state;

    const existingCard: Card | undefined = Array.from(state.cards.values()).find(c => c.cardId === existingChecklist.cardId);
    if (!existingCard) return state;

    const updatedChecklistIds: number[] = [...existingCard.checklistIds];
    const removeIndex: number = existingCard.checklistIds.indexOf(payload.checklistId);
    if (removeIndex !== -1) {
        updatedChecklistIds.splice(removeIndex, 1);
    }

    updatedChecklistIds.splice(payload.toIndex, 0, payload.checklistId);

    const newCards: Map<number, Card> = new Map(state.cards);
    newCards.set(existingChecklist.cardId, {
        ...existingCard,
        checklistIds: updatedChecklistIds
    })

    return {
        ...state,
        cards: newCards,
    }

}

export default moveChecklistAction;