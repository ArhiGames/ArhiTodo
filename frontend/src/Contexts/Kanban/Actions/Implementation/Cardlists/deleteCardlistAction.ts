import type {State} from "../../../../../Models/States/types.ts";

const deleteCardlistAction = (state: State, cardListId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [cardListId]: _, ...newCardLists } = state.cardLists;

    return {
        ...state,
        cardLists: newCardLists
    }
}

export default deleteCardlistAction;