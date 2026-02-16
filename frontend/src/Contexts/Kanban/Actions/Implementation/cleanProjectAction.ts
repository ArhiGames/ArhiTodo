import type {Board, State} from "../../../../Models/States/types.ts";
import cleanBoardAction from "./cleanBoardAction.ts";

const cleanProjectAction = (state: State, projectId: number) =>  {

    const newBoards: Record<number, Board> = {};

    const boardIdsToRemove = Object.values(state.boards)
        .filter(b => b.projectId === projectId)
        .map(b => b.boardId);

    const { newCardLists, newCards, newLabels, newCardLabels, newChecklists, newChecklistItems } = cleanBoardAction(state, boardIdsToRemove);

    return { newBoards, newCardLists, newCards, newLabels, newCardLabels, newChecklists, newChecklistItems };

}

export default cleanProjectAction;