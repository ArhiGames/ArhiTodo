import type {Label, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type { UpdateLabelPayload } from "../../KanbanAction.ts";

const updateLabelAction = (state: KanbanState, payload: UpdateLabelPayload) => {

    const newLabels: Map<number, Label> = new Map(state.labels);
    const existingLabel: Label | undefined = state.labels.get(payload.labelId);
    if (!existingLabel) return state;

    newLabels.set(payload.labelId, {
        ...existingLabel,
        labelColor: payload.labelColor,
        labelText: payload.labelText
    })

    return {
        ...state,
        labels: newLabels
    }

}

export default updateLabelAction;