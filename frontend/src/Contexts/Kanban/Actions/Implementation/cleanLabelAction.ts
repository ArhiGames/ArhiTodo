import type {KanbanState} from "../../../../Models/States/KanbanState.ts";

const cleanLabelAction = (state: KanbanState, labelIds: number[]) => {

    const newCardLabels: Map<number, number[]> = new Map(state.cardLabels);

    for (const cardId of Object.keys(state.cardLabels)) {
        const cardLabelIds = state.cardLabels.get(Number(cardId));
        if (!cardLabelIds) continue;

        for (const cardLabelId of cardLabelIds) {
            if (labelIds.includes(cardLabelId)) {
                cardLabelIds.splice(cardLabelIds.indexOf(cardLabelId), 1);
            }
        }
    }

    return { newCardLabels: newCardLabels };

}

export default cleanLabelAction;