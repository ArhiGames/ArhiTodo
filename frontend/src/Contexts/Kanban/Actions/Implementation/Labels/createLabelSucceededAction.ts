import type {Label, KanbanState, Board} from "../../../../../Models/States/KanbanState.ts";
import type { CreateLabelSucceededPayload } from "../../KanbanAction.ts";

const createLabelSucceededAction = (state: KanbanState, payload: CreateLabelSucceededPayload) => {

    const label: Label | undefined = state.labels.get(payload.predictedLabelId);
    if (!label) return state;

    const board: Board | undefined = state.boards.get(label.boardId);
    if (!board) return state;

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(board.boardId, {
        ...board,
        labelIds: board.labelIds.map((labelId: number) => labelId === payload.predictedLabelId ? payload.actualLabelId : labelId)
    });

    const newLabels: Map<number, Label> = new Map(state.labels);
    const existingLabel: Label | undefined = state.labels.get(payload.predictedLabelId);
    if (!existingLabel) return state;

    newLabels.set(payload.actualLabelId, {
        ...existingLabel,
        labelId: payload.actualLabelId
    });
    newLabels.delete(payload.predictedLabelId);

    return {
        ...state,
        boards: newBoards,
        labels: newLabels
    }

}

export default createLabelSucceededAction;