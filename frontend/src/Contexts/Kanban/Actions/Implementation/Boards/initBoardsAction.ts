import type {Board, State} from "../../../../../Models/States/types.ts";
import type { InitBoardsPayload } from "../../Action.ts";

const initBoardsAction = (state: State, payload: { projectId: number, boards: InitBoardsPayload[] }) => {

    const boards: Map<number, Board> = new Map();
    for (const board of payload.boards) {
        boards.set(board.boardId, {
            projectId: payload.projectId,
            boardId: board.boardId,
            boardName: board.boardName,
            ownedByUserId: board.ownedByUserId
        });
    }

    return {
        ...state,
        boards: boards
    }

}

export default initBoardsAction;