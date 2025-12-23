import type {Board, State} from "../../../../Models/States/types.ts";
import type { InitBoardsPayload } from "../Action.ts";

const initBoardsAction = (state: State, payload: InitBoardsPayload[]) => {

    const boards: Record<number, Board> = payload.reduce((acc, b) => {
        acc[b.boardId] = {
            boardId: b.boardId,
            boardName: b.boardName,
        }
        return acc;
    }, {} as Record<number, Board>);

    return {
        ...state,
        boards: boards
    }

}

export default initBoardsAction;