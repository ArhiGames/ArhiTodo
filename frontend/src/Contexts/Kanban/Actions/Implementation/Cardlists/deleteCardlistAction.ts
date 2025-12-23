import type {State} from "../../../../../Models/States/types.ts";

const deleteCardlistAction = (state: State, cardListId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [cardListId]: _, ...newCardLists } = state.cardLists;

    return {
        boards: state.boards,
        cardLists: newCardLists,
        cards: state.cards
    }
}

export default deleteCardlistAction;