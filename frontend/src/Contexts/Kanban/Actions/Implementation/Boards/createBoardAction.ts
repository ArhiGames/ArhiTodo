import type {Board, KanbanState, Project} from "../../../../../Models/States/KanbanState.ts";
import type { CreateBoardPayload } from "../../KanbanAction.ts";

const createBoardAction = (state: KanbanState, payload: CreateBoardPayload): KanbanState => {

    const project: Project | undefined = state.projects.get(payload.projectId);
    if (!project) return state;

    const newProjects: Map<number, Project> = new Map(state.projects);
    newProjects.set(payload.projectId, {
        ...project,
        boardIds: [...project.boardIds, payload.boardId],
    });

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.set(payload.boardId, {
        projectId: payload.projectId,
        boardId: payload.boardId,
        boardName: payload.boardName,
        ownedByUserId: payload.ownedByUserId,
        boardMembers: [],
        cardListIds: [],
        labelIds: []
    });

    return {
        ...state,
        projects: newProjects,
        boards: newBoards
    }

}

export default createBoardAction;