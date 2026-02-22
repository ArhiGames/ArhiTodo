import type {KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanCardListAction from "../cleanCardListAction.ts";

const removeCardsFromCardlistAction = (state: KanbanState, fromCardListId: number)=> {

    const { newCards, newCardLabels, newChecklists, newChecklistItems } = cleanCardListAction(state, [fromCardListId]);

    return {
        ...state,
        cards: newCards,
        newCardLabels: newCardLabels,
        newChecklists: newChecklists,
        newChecklistItems: newChecklistItems,
    }

}

export default removeCardsFromCardlistAction;