import type {Board, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type { InitBoardsPayload } from "../../KanbanAction.ts";

const initBoardsAction = (state: KanbanState, payload: { projectId: number, boards: InitBoardsPayload[] }): KanbanState => {

    const boards: Map<number, Board> = new Map();
    for (const board of payload.boards) {
        boards.set(board.boardId, {
            projectId: payload.projectId,
            boardId: board.boardId,
            boardName: board.boardName,
            ownedByUserId: board.ownedByUserId,
            boardMembers: [],
            cardListIds: []
        });
    }

    return {
        ...state,
        boards: boards
    }

}

export default initBoardsAction;