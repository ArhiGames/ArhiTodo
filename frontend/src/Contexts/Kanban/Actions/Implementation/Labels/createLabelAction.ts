import type {Label, State} from "../../../../../Models/States/types.ts";
import type { CreateLabelPayload } from "../../Action.ts";

const createLabelAction = (state: State, payload: CreateLabelPayload) => {

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