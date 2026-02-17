import type {State} from "../../../../../Models/States/types.ts";
import type {ChangeLabelCardRelationPayload} from "../../Action.ts";

const removeLabelFromCard = (state: State, payload: ChangeLabelCardRelationPayload) => {

    const newCardLabels: Map<number, number[]> = new Map(state.cardLabels);

    let labelIds: number[] | undefined = state.cardLabels.get(payload.cardId);
    if (!labelIds) return state;

    const labelToRemoveIndex: number = labelIds.findIndex((id: number) => id === payload.labelId);
    if (labelToRemoveIndex === -1) return state;

    labelIds = labelIds.splice(labelToRemoveIndex, 1);
    newCardLabels.set(payload.cardId, labelIds);

    return {
        ...state,
        cardLabels: newCardLabels
    }

}

export default removeLabelFromCard;