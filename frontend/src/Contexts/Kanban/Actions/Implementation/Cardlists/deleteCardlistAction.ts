import type {CardList, State} from "../../../../../Models/States/types.ts";
import cleanCardListAction from "../cleanCardListAction.ts";

const deleteCardlistAction = (state: State, cardListId: number) => {

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