import type {Card, Checklist, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanChecklistAction from "../cleanChecklistAction.ts";

const deleteChecklistAction = (state: KanbanState, checklistId: number) => {

    const checklist: Checklist | undefined = state.checklists.get(checklistId);
    if (!checklist) return state;

    const card: Card | undefined = state.cards.get(checklist.cardId);
    if (!card) return state;

    const newCards: Map<number, Card> = new Map(state.cards);

    const indexToRemove: number = card.checklistIds.indexOf(checklistId);
    if (indexToRemove !== -1) {
        const newChecklistIds: number[] = [...card.checklistIds];
        newChecklistIds.splice(indexToRemove, 1);

        newCards.set(card.cardId, {
            ...card,
            checklistIds: newChecklistIds,
        });
    }

    const restChecklists: Map<number, Checklist> = new Map(state.checklists);
    restChecklists.delete(checklistId);

    const { newChecklistItems } = cleanChecklistAction(state, [checklistId]);

    return {
        ...state,
        cards: newCards,
        checklists: restChecklists,
        checklistItems: newChecklistItems
    }

}

export default deleteChecklistAction;