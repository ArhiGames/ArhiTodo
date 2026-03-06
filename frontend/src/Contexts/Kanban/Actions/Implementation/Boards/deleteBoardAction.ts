import type {Board, KanbanState, Project} from "../../../../../Models/States/KanbanState.ts";
import cleanBoardAction from "../cleanBoardAction.ts";

const deleteBoardAction = (state: KanbanState, deleteBoardId: number) => {

    const board: Board | undefined = state.boards.get(deleteBoardId);
    if (!board) return state;

    const project: Project | undefined = state.projects.get(board.projectId);
    if (!project) return state;

    const newProjects: Map<number, Project> = new Map(state.projects);

    const indexToRemove: number = project.boardIds.indexOf(deleteBoardId);
    if (indexToRemove !== -1) {
        const newBoardIds: number[] = [...project.boardIds];
        newBoardIds.splice(indexToRemove, 1);

        newProjects.set(project.projectId, {
            ...project,
            boardIds: newBoardIds
        })
    }

    const newBoards: Map<number, Board> = new Map(state.boards);
    newBoards.delete(deleteBoardId);

    const { newCardLists, newCards, newLabels, newCardLabels, newChecklists, newChecklistItems } = cleanBoardAction(state, [deleteBoardId]);

    return {
        ...state,
        projects: newProjects,
        labels: newLabels,
        boards: newBoards,
        cardLists: newCardLists,
        cards: newCards,
        checklists: newChecklists,
        checklistItems: newChecklistItems,
        cardLabels: newCardLabels
    }

}

export default deleteBoardAction;