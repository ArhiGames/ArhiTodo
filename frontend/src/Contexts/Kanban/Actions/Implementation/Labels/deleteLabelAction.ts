import type {Label, KanbanState, Board} from "../../../../../Models/States/KanbanState.ts";
import cleanLabelAction from "../cleanLabelAction.ts";

const deleteLabelAction = (state: KanbanState, labelToDelete: number ) => {

    const label: Label | undefined = state.labels.get(labelToDelete);
    if (!label) return state;

    const board: Board | undefined = state.boards.get(label.boardId);
    if (!board) return state;

    const newBoards: Map<number, Board> = new Map(state.boards);

    const indexToRemove: number = board.labelIds.indexOf(labelToDelete);
    if (indexToRemove !== -1) {
        const newLabelIds: number[] = [...board.labelIds];
        newLabelIds.splice(indexToRemove, 1);

        newBoards.set(board.boardId, {
            ...board,
            labelIds: newLabelIds,
        });
    }

    const restLabels: Map<number, Label> = new Map(state.labels);
    restLabels.delete(labelToDelete);

    const { newCardLabels } = cleanLabelAction(state, [labelToDelete]);

    return {
        ...state,
        boards: newBoards,
        labels: restLabels,
        cardLabels: newCardLabels
    }

}

export default deleteLabelAction;