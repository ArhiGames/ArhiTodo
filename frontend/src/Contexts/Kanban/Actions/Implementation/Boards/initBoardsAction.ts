import type {Board, State} from "../../../../../Models/States/types.ts";
import type { InitBoardsPayload } from "../../Action.ts";

const initBoardsAction = (state: State, payload: { projectId: number, boards: InitBoardsPayload[] }) => {

    const boards: Record<number, Board> = payload.boards.reduce((acc, b) => {
        acc[b.boardId] = {
            projectId: payload.projectId,
            boardId: b.boardId,
            boardName: b.boardName,
            ownedByUserId: b.ownedByUserId
        }
        return acc;
    }, {} as Record<number, Board>);

    return {
        ...state,
        boards: boards
    }

}

export default initBoardsAction;