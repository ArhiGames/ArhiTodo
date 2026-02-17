import type {Board, State} from "../../../../Models/States/types.ts";
import cleanBoardAction from "./cleanBoardAction.ts";

const cleanProjectAction = (state: State, projectId: number) =>  {

    const newBoards: Map<number, Board> = new Map(state.boards);

    const boardIdsToRemove = Array.from(state.boards.values())
        .filter(b => b.projectId === projectId)
        .map(b => b.boardId);

    boardIdsToRemove.forEach(id => newBoards.delete(id));

    const { newCardLists, newCards, newLabels, newCardLabels, newChecklists, newChecklistItems } = cleanBoardAction(state, boardIdsToRemove);

    return { newBoards, newCardLists, newCards, newLabels, newCardLabels, newChecklists, newChecklistItems };

}

export default cleanProjectAction;