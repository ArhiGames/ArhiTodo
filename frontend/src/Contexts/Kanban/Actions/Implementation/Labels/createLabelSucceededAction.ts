import type {Label, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type { CreateLabelSucceededPayload } from "../../KanbanAction.ts";

const createLabelSucceededAction = (state: KanbanState, payload: CreateLabelSucceededPayload) => {

    const newLabels: Map<number, Label> = new Map(state.labels);
    const existingLabel: Label | undefined = state.labels.get(payload.predictedLabelId);
    if (!existingLabel) return state;

    newLabels.set(payload.actualLabelId, {
        ...existingLabel,
        labelId: payload.actualLabelId
    });
    newLabels.delete(payload.predictedLabelId);

    return {
        ...state,
        labels: newLabels
    }

}

export default createLabelSucceededAction;