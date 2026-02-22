import type {CardList, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateCardlistSucceededPayload} from "../../KanbanAction.ts";

const createCardlistSucceededAction = (state: KanbanState, payload: CreateCardlistSucceededPayload) => {

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