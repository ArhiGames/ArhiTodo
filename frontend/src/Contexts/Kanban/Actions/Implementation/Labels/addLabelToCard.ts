import type { State } from "../../../../../Models/States/types.ts";
import type { ChangeLabelCardRelationPayload } from "../../Action.ts";

const addLabelToCard = (state: State, payload: ChangeLabelCardRelationPayload) => {

    const cardLabelIds: number[] = state.cardLabels[payload.cardId];
    if (!cardLabelIds.includes(payload.labelId)) {
        cardLabelIds.push(payload.labelId);
    }

    return {
        ...state,
        cardLabels: {
            ...state.cardLabels,
            [payload.cardId]: cardLabelIds
        }
    }

}

export default addLabelToCard;