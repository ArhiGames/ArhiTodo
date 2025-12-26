import type { State } from "../../../../../Models/States/types.ts";
import type { CreateLabelSucceededPayload } from "../../Action.ts";

const createLabelSucceededAction = (state: State, payload: CreateLabelSucceededPayload) => {

    const { [payload.predictedLabelId]: labelToUpdate, ...restLabels } = state.labels;

    return {
        ...state,
        labels: {
            ...restLabels,
            [payload.actualLabelId]: {
                ...labelToUpdate,
                labelId: payload.actualLabelId
            }
        }
    }

}

export default createLabelSucceededAction;