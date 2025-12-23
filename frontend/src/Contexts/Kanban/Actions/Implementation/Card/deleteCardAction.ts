import type { State } from "../../../../../Models/States/types.ts";

const deleteCardAction = (state: State, failedCardId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [failedCardId]: _, ...restCards } = state.cards;

    return {
        ...state,
        cards: restCards
    }

}

export default deleteCardAction;