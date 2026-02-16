import type {State} from "../../../../../Models/States/types.ts";
import cleanCardListAction from "../cleanCardListAction.ts";

const deleteCardlistAction = (state: State, cardListId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [cardListId]: _, ...newCardLists } = state.cardLists;

    const { newCards, newCardLabels, newChecklists, newChecklistItems } = cleanCardListAction(state, [cardListId]);

    return {
        ...state,
        cardLists: newCardLists,
        cards: newCards,
        cardLabels: newCardLabels,
        checklists: newChecklists,
        checklistItems: newChecklistItems
    }
}

export default deleteCardlistAction;