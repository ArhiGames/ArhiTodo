import type {State} from "../../../../../Models/States/types.ts";
import cleanCardListAction from "../cleanCardListAction.ts";

const removeCardsFromCardlistAction = (state: State, fromCardListId: number)=> {

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