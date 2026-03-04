import type {Board, KanbanState, Project} from "../../../../../Models/States/KanbanState.ts";
import type { InitBoardsPayload } from "../../KanbanAction.ts";

const initBoardsAction = (state: KanbanState, payload: { projectId: number, boards: InitBoardsPayload[] }): KanbanState => {

    const projects: Map<number, Project> = new Map(state.projects);
    const boards: Map<number, Board> = new Map(state.boards);

    for (const board of payload.boards) {
        projects.get(payload.projectId)?.boardIds.push(board.boardId);
        boards.set(board.boardId, {
            projectId: payload.projectId,
            boardId: board.boardId,
            boardName: board.boardName,
            ownedByUserId: board.ownedByUserId,
            boardMembers: [],
            cardListIds: [],
            labelIds: []
        });
    }

    return {
        ...state,
        boards: boards
    }

}

export default initBoardsAction;