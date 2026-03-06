import type {Board, KanbanState, Project} from "../../../../../Models/States/KanbanState.ts";
import type {CreateBoardSucceededPayload} from "../../KanbanAction.ts";

const createBoardSucceededAction = (state: KanbanState, payload: CreateBoardSucceededPayload) => {

    const oldBoard: Board | undefined = state.boards.get(payload.predictedBoardId);
    if (!oldBoard) return state;

    const oldProject: Project | undefined = state.projects.get(oldBoard.projectId);
    if (!oldProject) return state;

    const newProjects: Map<number, Project> = new Map(state.projects);
    const newBoards: Map<number, Board> = new Map(state.boards);

    newProjects.set(oldProject.projectId, {
        ...oldProject,
        boardIds: oldProject.boardIds.map((boardId: number) => boardId === payload.predictedBoardId ? payload.actualBoardId : boardId)
    })

    newBoards.set(payload.actualBoardId, {
        ...oldBoard,
        boardId: payload.actualBoardId
    });
    newBoards.delete(payload.predictedBoardId);

    return {
        ...state,
        projects: newProjects,
        boards: newBoards
    }

}

export default createBoardSucceededAction;