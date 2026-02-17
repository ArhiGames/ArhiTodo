import type {Label, State} from "../../../../../Models/States/types.ts";
import cleanLabelAction from "../cleanLabelAction.ts";

const deleteLabelAction = (state: State, labelToDelete: number ) => {

    const restLabels: Map<number, Label> = new Map(state.labels);
    restLabels.delete(labelToDelete);

    const { newCardLabels } = cleanLabelAction(state, [labelToDelete]);

    return {
        ...state,
        labels: restLabels,
        cardLabels: newCardLabels
    }

}

export default deleteLabelAction;