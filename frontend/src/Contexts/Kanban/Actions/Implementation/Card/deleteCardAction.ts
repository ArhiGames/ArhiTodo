import type { State } from "../../../../../Models/States/types.ts";
import cleanCardAction from "../cleanCardAction.ts";

const deleteCardAction = (state: State, failedCardId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [failedCardId]: _, ...restCards } = state.cards;

    const { newCardLabels, newChecklists, newChecklistItems } = cleanCardAction(state, [failedCardId]);

    return {
        ...state,
        cards: restCards,
        cardLabels: newCardLabels,
        checklists: newChecklists,
        newChecklistItems: newChecklistItems
    }

}

export default deleteCardAction;