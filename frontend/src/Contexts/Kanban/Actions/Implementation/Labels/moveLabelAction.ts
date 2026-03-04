import type {Board, KanbanState, Label} from "../../../../../Models/States/KanbanState.ts";
import type { MoveLabelPayload} from "../../KanbanAction.ts";

const moveLabelAction = (state: KanbanState, payload: MoveLabelPayload): KanbanState => {

    const existingLabel: Label | undefined = Array.from(state.labels.values()).find(l => l.labelId === payload.labelId);
    if (!existingLabel) return state;

    const existingBoard: Board | undefined = Array.from(state.boards.values()).find(b => b.boardId === existingLabel.boardId);
    if (!existingBoard) return state;

    const updatedLabelIds: number[] = [...existingBoard.labelIds];
    const removeIndex: number = existingBoard.labelIds.indexOf(payload.labelId);
    if (removeIndex !== -1) {
        updatedLabelIds.splice(removeIndex, 1);
    }

    updatedLabelIds.splice(payload.toIndex, 0, payload.labelId);

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(existingBoard.boardId, {
        ...existingBoard,
        labelIds: updatedLabelIds
    })

    return {
        ...state,
        boards: newBoards,
    }

}

export default moveLabelAction;