import type {CardList, State} from "../../../../../Models/States/types.ts";
import type {UpdateCardlistPayload} from "../../Action.ts";

const updateCardlistAction = (state: State, payload: UpdateCardlistPayload) => {

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