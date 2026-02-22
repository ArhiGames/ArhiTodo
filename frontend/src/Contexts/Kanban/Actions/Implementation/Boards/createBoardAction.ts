import type {Board, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type { CreateBoardPayload } from "../../KanbanAction.ts";

const createBoardAction = (state: KanbanState, payload: CreateBoardPayload): KanbanState => {

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(payload.boardId, {
        projectId: payload.projectId,
        boardId: payload.boardId,
        boardName: payload.boardName,
        ownedByUserId: payload.ownedByUserId,
        boardMembers: []
    });

    return {
        ...state,
        boards: newBoards
    }

}

export default createBoardAction;