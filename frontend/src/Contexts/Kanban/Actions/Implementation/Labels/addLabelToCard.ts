import type { State } from "../../../../../Models/States/types.ts";
import type { ChangeLabelCardRelationPayload } from "../../Action.ts";

const addLabelToCard = (state: State, payload: ChangeLabelCardRelationPayload) => {

    const cardLabels: Map<number, number[]> = new Map(state.cardLabels);
    const cardLabelIds: number[] | undefined = cardLabels.get(payload.cardId);
    if (!cardLabelIds) return state;

    if (!cardLabelIds.includes(payload.labelId)) {
        cardLabelIds.push(payload.labelId);
    }

    return {
        ...state,
        cardLabels: cardLabels
    }

}

export default addLabelToCard;