import type {Card, Checklist, ChecklistItem, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateChecklistItemStateAction} from "../../KanbanAction.ts";

const changeChecklistItemStateAction = (state: KanbanState, payload: UpdateChecklistItemStateAction) => {

    const newChecklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);
    const existingChecklistItem: ChecklistItem | undefined = state.checklistItems.get(payload.checklistItemId);
    if (!existingChecklistItem) return state;

    newChecklistItems.set(payload.checklistItemId, {
        ...existingChecklistItem,
        isDone: payload.newState
    });

    const existingChecklist: Checklist | undefined = Array.from(state.checklists.values()).find((c: Checklist) => existingChecklistItem.checklistId === c.checklistId);
    if (!existingChecklist) return state;

    const newCards: Map<number, Card> = new Map(state.cards);
    const existingCard: Card | undefined = state.cards.get(existingChecklist.cardId);
    if (!existingCard) return state;

    const checklists: Checklist[] = [];
    for (const checklist of state.checklists.values()) {
        if (checklist.cardId === existingChecklist.cardId) {
            checklists.push(checklist);
        }
    }

    const checklistItems: ChecklistItem[] = [];
    for (const checklistItem of state.checklistItems.values()) {
        if (checklists.some((c: Checklist) => checklistItem.checklistId == c.checklistId)) {
            checklistItems.push(checklistItem);
        }
    }

    const isCompleted: boolean = !checklistItems.some((ci: ChecklistItem) => !ci.isDone);
    newCards.set(existingChecklist.cardId, {
        ...existingCard,
        isDone: isCompleted
    });

    return {
        ...state,
        cards: newCards,
        checklistItems: newChecklistItems
    }

}

export default changeChecklistItemStateAction;