import type {Board, KanbanState, Project} from "../../../../../Models/States/KanbanState.ts";
import type { InitBoardsPayload } from "../../KanbanAction.ts";
import cleanBoardAction from "../cleanBoardAction.ts";

const initBoardsAction = (state: KanbanState, payload: { projectId: number, boards: InitBoardsPayload[] }): KanbanState => {

    const project: Project | undefined = state.projects.get(payload.projectId);
    if (!project) return state;

    const projects: Map<number, Project> = new Map(state.projects);
    const boards: Map<number, Board> = new Map(state.boards);

    const boardIds: number[] = [];
    for (const board of payload.boards) {
        boardIds.push(board.boardId);
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
    projects.set(payload.projectId, {
        ...project,
        boardIds: boardIds
    });

    const { newCardLists: newCardLists, newCards: newCards, newLabels: newLabels, newCardLabels: newCardLabels,
        newChecklists: newChecklists, newChecklistItems: newChecklistItems } = cleanBoardAction(state, project.boardIds);

    return {
        ...state,
        projects: projects,
        boards: boards,
        cardLists: newCardLists,
        cards: newCards,
        labels: newLabels,
        cardLabels: newCardLabels,
        checklists: newChecklists,
        checklistItems: newChecklistItems
    }

}

export default initBoardsAction;