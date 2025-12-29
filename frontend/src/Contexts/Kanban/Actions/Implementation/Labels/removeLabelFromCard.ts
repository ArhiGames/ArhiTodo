import type {State} from "../../../../../Models/States/types.ts";
import type {ChangeLabelCardRelationPayload} from "../../Action.ts";

const removeLabelFromCard = (state: State, payload: ChangeLabelCardRelationPayload) => {

    let labelIds: number[] = state.cardLabels[payload.cardId];
    const labelToRemoveIndex: number = labelIds.findIndex((id: number) => id === payload.labelId);

    if (labelToRemoveIndex === -1) {
        return {
            ...state
        }
    }

    labelIds = labelIds.splice(labelToRemoveIndex, 1);

    return {
        ...state,
        cardLabels: {
            ...state.cardLabels,
            [payload.cardId]: labelIds
        }
    }

}

export default removeLabelFromCard;