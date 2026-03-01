import type {Board, Card, CardList, KanbanState} from "../../../../Models/States/KanbanState.ts";
import cleanCardAction from "./cleanCardAction.ts";

const cleanCardListAction = (state: KanbanState, cardListIds: number[]) => {
    for (const cardListId of cardListIds) {
        const cardList: CardList | undefined = state.cardLists.get(cardListId);
        if (!cardList) return { newCards: state.cards, newCardLabels: state.cardLabels, newChecklists: state.checklists, newChecklistItems: state.checklistItems };

        const board: Board | undefined = state.boards.get(cardList.boardId);
        if (!board) return { newCards: state.cards, newCardLabels: state.cardLabels, newChecklists: state.checklists, newChecklistItems: state.checklistItems };

        const indexToRemove: number = board.cardListIds.indexOf(cardListId);
        if (indexToRemove !== -1) {
            board.cardListIds.splice(indexToRemove, 1);
        }
    }

    const newCards: Map<number, Card> = new Map(state.cards);

    const cardIdsToDelete = Array.from(state.cards.values())
        .filter(c => cardListIds.includes(c.cardListId))
        .map(c => c.cardId);
    
    const { newCardLabels, newChecklists, newChecklistItems } = cleanCardAction(state, cardIdsToDelete);

    cardIdsToDelete.forEach(id => newCards.delete(id));

    return { newCards: newCards, newCardLabels: newCardLabels, newChecklists: newChecklists, newChecklistItems: newChecklistItems };
}

export default cleanCardListAction;