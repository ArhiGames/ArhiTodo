import type {Board, State} from "../../../../../Models/States/types.ts";
import type {CreateBoardSucceededPayload} from "../../Action.ts";

const createBoardSucceededAction = (state: State, payload: CreateBoardSucceededPayload) => {

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