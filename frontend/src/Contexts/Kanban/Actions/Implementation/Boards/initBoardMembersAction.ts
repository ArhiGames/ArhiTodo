import type {Board, State} from "../../../../../Models/States/types.ts";
import type {InitBoardMembersPayload} from "../../Action.ts";

const initBoardMembersAction = (state: State, payload: InitBoardMembersPayload): State => {

    const board: Board | undefined = state.boards.get(payload.boardId);
    if (!board) return state;

    board.boardMembers = payload.boardMembers;
    state.boards.set(payload.boardId, board);

    return { ...state }

}

export default initBoardMembersAction;