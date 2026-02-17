import type {Board, State} from "../../../../../Models/States/types.ts";
import type { UpdateBoardPayload } from "../../Action.ts";

const updateBoardAction = (state: State, payload: UpdateBoardPayload) => {

    const newBoards: Map<number, Board> = new Map(state.boards);

    const updatingBoard: Board | undefined = newBoards.get(payload.boardId);
    if (!updatingBoard) return state;

    newBoards.set(payload.boardId, {
        ...updatingBoard,
        boardName: payload.boardName
    })

    return {
        ...state,
        boards: newBoards
    }

}

export default updateBoardAction;