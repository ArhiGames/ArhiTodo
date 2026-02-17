import type {CardList, State} from "../../../../../Models/States/types.ts";
import type {CreateCardlistSucceededPayload} from "../../Action.ts";

const createCardlistSucceededAction = (state: State, payload: CreateCardlistSucceededPayload) => {

    const newCardlists: Map<number, CardList> = new Map(state.cardLists);
    const existingCardList: CardList | undefined = state.cardLists.get(payload.predictedCardlistId);
    if (!existingCardList) return state;

    newCardlists.set(payload.actualCardlistId, {
        ...existingCardList,
        cardListId: payload.actualCardlistId
    });
    newCardlists.delete(payload.predictedCardlistId);

    return {
        ...state,
        cardLists: newCardlists
    }

}

export default createCardlistSucceededAction;