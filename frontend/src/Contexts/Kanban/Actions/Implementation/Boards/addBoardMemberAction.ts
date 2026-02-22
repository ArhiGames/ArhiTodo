import type {Board, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type {AddBoardMembersPayload} from "../../KanbanAction.ts";

const addBoardMemberAction = (state: KanbanState, payload: AddBoardMembersPayload): KanbanState => {

    const board: Board | undefined = state.boards.get(payload.boardId);
    if (!board) return state;

    if (!board.boardMembers.some(bm => bm.userId === payload.boardMember.userId)) {
        board.boardMembers.push(payload.boardMember);
    }

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(payload.boardId, board);

    return {
        ...state,
        boards: newBoards
    }

}

export default addBoardMemberAction;