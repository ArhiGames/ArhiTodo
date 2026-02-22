import type {CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {UpdateCardlistPayload} from "../../KanbanAction.ts";

const updateCardlistAction = (state: KanbanState, payload: UpdateCardlistPayload) => {

    const newCardlists: Map<number, CardList> = new Map(state.cardLists);
    const existingCardList: CardList | undefined = state.cardLists.get(payload.cardListId);
    if (!existingCardList) return state;

    newCardlists.set(payload.cardListId, {
        ...existingCardList,
        cardListName: payload.cardListName
    });

    return {
        ...state,
        cardLists: newCardlists
    }

}

export default updateCardlistAction;