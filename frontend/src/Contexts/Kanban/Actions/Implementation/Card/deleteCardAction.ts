import type { State } from "../../../../../Models/States/types.ts";

const deleteCardAction = (state: State, failedCardId: number) => {

    const cardLabels: Record<number, number[]> = {}; // cardId <-> labelIds

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [failedCardId]: _, ...restCards } = state.cards;

    for (const cardId of Object.keys(state.cardLabels)) {
        const numCardId: number = Number(cardId);
        if (numCardId !== failedCardId) {
            cardLabels[numCardId] = state.cardLabels[numCardId];
        }
    }

    return {
        ...state,
        cards: restCards,
        cardLabels: cardLabels,
    }

}

export default deleteCardAction;