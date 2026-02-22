import type {Label, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type { CreateLabelPayload } from "../../KanbanAction.ts";

const createLabelAction = (state: KanbanState, payload: CreateLabelPayload) => {

    const labels: Map<number, Label> = new Map(state.labels);
    labels.set(payload.labelId, {
        boardId: payload.boardId,
        labelId: payload.labelId,
        labelText: payload.labelText,
        labelColor: payload.labelColor
    })

    return {
        ...state,
        labels: labels
    }

}

export default createLabelAction;