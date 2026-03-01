import type {KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {ChangeLabelCardRelationPayload} from "../../KanbanAction.ts";

const removeLabelFromCard = (state: KanbanState, payload: ChangeLabelCardRelationPayload) => {

    console.log(payload.labelId)

    const labelIds: number[] | undefined = state.cardLabels.get(payload.cardId);
    if (!labelIds) return state;

    const newCardLabels: Map<number, number[]> = new Map(state.cardLabels);

    const labelToRemoveIndex: number = labelIds.findIndex((id: number) => id === payload.labelId);
    if (labelToRemoveIndex !== -1) {
        labelIds.splice(labelToRemoveIndex, 1);
        newCardLabels.set(payload.cardId, labelIds);
    }

    return {
        ...state,
        cardLabels: newCardLabels
    }

}

export default removeLabelFromCard;