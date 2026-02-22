import type {CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanCardListAction from "../cleanCardListAction.ts";

const deleteCardlistAction = (state: KanbanState, cardListId: number) => {

    const newCardlists: Map<number, CardList> = new Map(state.cardLists);
    newCardlists.delete(cardListId);

    const { newCards, newCardLabels,
        newChecklists, newChecklistItems } = cleanCardListAction(state, [cardListId]);

    return {
        ...state,
        cardLists: newCardlists,
        cards: newCards,
        cardLabels: newCardLabels,
        checklists: newChecklists,
        checklistItems: newChecklistItems
    }
}

export default deleteCardlistAction;