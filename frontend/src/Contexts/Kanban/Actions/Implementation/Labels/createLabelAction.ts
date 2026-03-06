import type {Label, KanbanState, Board} from "../../../../../Models/States/KanbanState.ts";
import type { CreateLabelPayload } from "../../KanbanAction.ts";

const createLabelAction = (state: KanbanState, payload: CreateLabelPayload) => {

    const board: Board | undefined = state.boards.get(payload.boardId);
    if (!board) return state;

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(board.boardId, {
        ...board,
        labelIds: [...board.labelIds, payload.labelId]
    });

    const labels: Map<number, Label> = new Map(state.labels);
    labels.set(payload.labelId, {
        boardId: payload.boardId,
        labelId: payload.labelId,
        labelText: payload.labelText,
        labelColor: payload.labelColor
    })

    return {
        ...state,
        boards: newBoards,
        labels: labels
    }

}

export default createLabelAction;