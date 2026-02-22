import type {Board, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {CreateBoardSucceededPayload} from "../../KanbanAction.ts";

const createBoardSucceededAction = (state: KanbanState, payload: CreateBoardSucceededPayload) => {

    const newBoards: Map<number, Board> = new Map(state.boards);

    const oldBoard: Board | undefined = state.boards.get(payload.predictedBoardId);
    if (!oldBoard) return state;

    newBoards.set(payload.actualBoardId, {
        ...oldBoard,
        boardId: payload.actualBoardId
    });
    newBoards.delete(payload.predictedBoardId);

    return {
        ...state,
        boards: newBoards
    }

}

export default createBoardSucceededAction;