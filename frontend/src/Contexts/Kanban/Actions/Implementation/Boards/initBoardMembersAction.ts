import type {Board, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {InitBoardMembersPayload} from "../../KanbanAction.ts";

const initBoardMembersAction = (state: KanbanState, payload: InitBoardMembersPayload): KanbanState => {

    const board: Board | undefined = state.boards.get(payload.boardId);
    if (!board) return state;

    board.boardMembers = payload.boardMembers;
    state.boards.set(payload.boardId, board);

    return { ...state }

}

export default initBoardMembersAction;