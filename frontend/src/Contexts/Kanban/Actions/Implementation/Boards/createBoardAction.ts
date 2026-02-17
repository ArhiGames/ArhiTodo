import type {Board, State} from "../../../../../Models/States/types.ts";
import type { CreateBoardPayload } from "../../Action.ts";

const createBoardAction = (state: State, payload: CreateBoardPayload): State => {

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(payload.boardId, {
        projectId: payload.projectId,
        boardId: payload.boardId,
        boardName: payload.boardName,
        ownedByUserId: payload.ownedByUserId
    });

    return {
        ...state,
        boards: newBoards
    }

}

export default createBoardAction;