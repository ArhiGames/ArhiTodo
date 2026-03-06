import type {Card, CardList, Checklist, ChecklistItem, KanbanState} from "../../Models/States/KanbanState.ts";

export type CardMoveIndexByIdResult = {
    newIndex: number;
    newCardListId: number;
}

export type ChecklistItemMoveIndexByIdResult = {
    newIndex: number;
    newChecklistId: number;
}

function extractId(stringId: string): number {
    return Number(stringId.slice(stringId.indexOf("-") + 1));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getCardMoveIndex = (state: KanbanState, target: any): CardMoveIndexByIdResult | undefined => {
    const movedToCard: Card | undefined = state.cards.get(extractId(target.id));
    if (!movedToCard) return undefined;

    return { newIndex: target.data.index, newCardListId: movedToCard.cardListId }
}

const getCardOnCardListMoveIndexById = (state: KanbanState, movedToCardListId: number): CardMoveIndexByIdResult | undefined => {
    const movedToCardList: CardList | undefined = state.cardLists.get(movedToCardListId);
    if (!movedToCardList) return undefined;

    const newIndex: number = Array.from(state.cards.values()).filter(c => c.cardListId === movedToCardListId).length;
    return { newIndex: newIndex, newCardListId: movedToCardListId };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getChecklistMoveIndex = (state: KanbanState, target: any): ChecklistItemMoveIndexByIdResult | undefined => {
    const movedToChecklistItem: ChecklistItem | undefined = state.checklistItems.get(extractId(target.id));
    if (!movedToChecklistItem) return undefined;

    return { newIndex: target.data.index, newChecklistId: movedToChecklistItem.checklistId }
}

const getChecklistItemOnChecklistItemIndexById =
    (state: KanbanState, movedToChecklistId: number): ChecklistItemMoveIndexByIdResult | undefined => {
    const movedToChecklist: Checklist | undefined = state.checklists.get(movedToChecklistId);
    if (!movedToChecklist) return undefined;

    const newIndex: number = Array.from(state.checklistItems.values()).filter(ci => ci.checklistId === movedToChecklistId).length;
    return { newIndex: newIndex, newChecklistId: movedToChecklistId };
}

export { extractId, getCardMoveIndex, getCardOnCardListMoveIndexById, getChecklistMoveIndex, getChecklistItemOnChecklistItemIndexById };