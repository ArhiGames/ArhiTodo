import type {Board, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {RemoveBoardMembersPayload} from "../../KanbanAction.ts";

const removeBoardMemberAction = (state: KanbanState, payload: RemoveBoardMembersPayload): KanbanState => {

    const board: Board | undefined = state.boards.get(payload.boardId);
    if (!board) return state;

    const indexToRemove = board.boardMembers.findIndex(bm => bm.userId === payload.boardMemberId);
    if (indexToRemove !== -1) {
        board.boardMembers.splice(indexToRemove, 1);
    }

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(payload.boardId, board);

    return {
        ...state,
        boards: newBoards,
    }

}

export default removeBoardMemberAction;