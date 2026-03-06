import type {CardList, Label, KanbanState, Project, Board} from "../../../../Models/States/KanbanState.ts";
import cleanCardListAction from "./cleanCardListAction.ts";

const cleanBoardAction = (state: KanbanState, boardIds: number[]) => {
    const newProjects: Map<number, Project> = new Map(state.projects);
    for (const boardId of boardIds) {
        const board: Board | undefined = state.boards.get(boardId);
        if (!board) return { newCardLists: state.cardLists, newCards: state.cards, newLabels: state.labels, newCardLabels: state.cardLabels,
            newChecklists: state.checklists, newChecklistItems: state.checklistItems };

        const project: Project | undefined = state.projects.get(board.projectId);
        if (!project) return { newCardLists: state.cardLists, newCards: state.cards, newLabels: state.labels, newCardLabels: state.cardLabels,
            newChecklists: state.checklists, newChecklistItems: state.checklistItems };

        const indexToRemove: number = project.boardIds.indexOf(boardId);
        if (indexToRemove !== -1) {
            newProjects.set(project.projectId, {
                ...project,
                boardIds: project.boardIds.splice(indexToRemove, 1)
            });
        }
    }

    const newLabels: Map<number, Label> = new Map(state.labels);
    const newCardLists: Map<number, CardList> = new Map(state.cardLists);

    const listIdsToDelete = Array.from(state.cardLists.values())
        .filter(cl => boardIds.includes(cl.boardId))
        .map(cl => cl.cardListId);

    const labelIdsToDelete = Array.from(state.labels.values())
        .filter(l => boardIds.includes(l.boardId))
        .map(l => l.labelId);

    const cardLabelIdsToDelete = Array.from(state.cardLabels.values())
        .filter(cardId => state.cardLabels.get(Number(cardId))?.some(l => labelIdsToDelete.includes(l)))
        .map(cardId => Number(cardId));

    const { newCards, newCardLabels, newChecklists, newChecklistItems } = cleanCardListAction(state, listIdsToDelete);

    listIdsToDelete.forEach(id => newCardLists.delete(id));
    labelIdsToDelete.forEach(id => newLabels.delete(id))
    cardLabelIdsToDelete.forEach(id => newCardLabels.delete(id));

    return { newCardLists: newCardLists, newCards: newCards, newLabels: newLabels,
        newCardLabels: newCardLabels, newChecklists: newChecklists, newChecklistItems: newChecklistItems };
}

export default cleanBoardAction;