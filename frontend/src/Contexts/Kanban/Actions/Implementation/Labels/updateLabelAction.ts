import type { State } from "../../../../../Models/States/types.ts";
import type { UpdateLabelPayload } from "../../Action.ts";

const updateLabelAction = (state: State, payload: UpdateLabelPayload) => {

    return {
        ...state,
        labels: {
            ...state.labels,
            [payload.labelId]: {
                ...state.labels[payload.labelId],
                labelColor: payload.labelColor,
                labelText: payload.labelText
            }
        }
    }

}

export default updateLabelAction;