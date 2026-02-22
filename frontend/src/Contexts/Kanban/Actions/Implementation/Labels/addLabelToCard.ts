import type { KanbanState } from "../../../../../Models/States/KanbanState.ts";
import type { ChangeLabelCardRelationPayload } from "../../KanbanAction.ts";

const addLabelToCard = (state: KanbanState, payload: ChangeLabelCardRelationPayload) => {

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