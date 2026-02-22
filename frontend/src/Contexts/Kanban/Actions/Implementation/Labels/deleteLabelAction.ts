import type {Label, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import cleanLabelAction from "../cleanLabelAction.ts";

const deleteLabelAction = (state: KanbanState, labelToDelete: number ) => {

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