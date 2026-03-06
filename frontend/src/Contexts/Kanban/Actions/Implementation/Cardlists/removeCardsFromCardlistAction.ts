import type {CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanCardListAction from "../cleanCardListAction.ts";

const removeCardsFromCardlistAction = (state: KanbanState, fromCardListId: number)=> {

    const cardList: CardList | undefined = state.cardLists.get(fromCardListId);
    if (!cardList) return state;

    const newCardLists: Map<number, CardList> = new Map(state.cardLists);
    newCardLists.set(fromCardListId, {
        ...cardList,
        cardIds: []
    })

    const { newCards, newCardLabels, newChecklists, newChecklistItems } = cleanCardListAction(state, [fromCardListId]);

    return {
        ...state,
        cardLists: newCardLists,
        cards: newCards,
        newCardLabels: newCardLabels,
        newChecklists: newChecklists,
        newChecklistItems: newChecklistItems,
    }

}

export default removeCardsFromCardlistAction;