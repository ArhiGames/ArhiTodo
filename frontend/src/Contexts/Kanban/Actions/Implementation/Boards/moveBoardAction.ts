import type {Board, KanbanState, Project} from "../../../../../Models/States/KanbanState.ts";
import type {MoveBoardPayload} from "../../KanbanAction.ts";

const moveBoardAction = (state: KanbanState, payload: MoveBoardPayload): KanbanState => {

    const existingBoard: Board | undefined = Array.from(state.boards.values()).find(b => b.boardId === payload.boardId);
    if (!existingBoard) return state;

    const existingProject: Project | undefined = Array.from(state.projects.values()).find(p => p.projectId === existingBoard.projectId);
    if (!existingProject) return state;

    const updatedBoardIds: number[] = [...existingProject.boardIds];
    const removeIndex: number = existingProject.boardIds.indexOf(payload.boardId);
    if (removeIndex !== -1) {
        updatedBoardIds.splice(removeIndex, 1);
    }

    updatedBoardIds.splice(payload.toIndex, 0, payload.boardId);

    const newProjects: Map<number, Project> = new Map(state.projects);
    newProjects.set(existingProject.projectId, {
        ...existingProject,
        boardIds: updatedBoardIds
    })

    return {
        ...state,
        projects: newProjects,
    }

}

export default moveBoardAction;