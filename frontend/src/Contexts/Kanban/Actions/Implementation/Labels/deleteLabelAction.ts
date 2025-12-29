import type { State } from "../../../../../Models/States/types.ts";

const deleteLabelAction = (state: State, payload: { labelToDelete: number } ) => {

    const cardLabels: Record<number, number[]> = {}; // cardId <-> labelIds

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [payload.labelToDelete]: _, ...restLabels } = state.labels;

    for (const cardId of Object.keys(state.cardLabels)) {

        if (!cardLabels[Number(cardId)]) {
            cardLabels[Number(cardId)] = [];
        }

        for (const labelId of state.cardLabels[Number(cardId)]) {
            if (Number(labelId) !== payload.labelToDelete) {
                cardLabels[Number(cardId)].push(Number(labelId));
            }
        }
    }

    return {
        ...state,
        labels: restLabels,
        cardLabels: cardLabels
    }

}

export default deleteLabelAction;