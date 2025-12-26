import type { State } from "../../../../../Models/States/types.ts";

const deleteLabelAction = (state: State, payload: { failedLabelId: number } ) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [payload.failedLabelId]: _, ...restLabels } = state.labels;

    return {
        ...state,
        labels: restLabels
    }

}

export default deleteLabelAction;