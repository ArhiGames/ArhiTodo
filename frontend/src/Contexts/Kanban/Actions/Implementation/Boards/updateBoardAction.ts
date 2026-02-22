import type {Board, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type { UpdateBoardPayload } from "../../KanbanAction.ts";

const updateBoardAction = (state: KanbanState, payload: UpdateBoardPayload) => {

    const newBoards: Map<number, Board> = new Map(state.boards);

    const updatingBoard: Board | undefined = newBoards.get(payload.boardId);
    if (!updatingBoard) return state;

    newBoards.set(payload.boardId, {
        ...updatingBoard,
        boardName: payload.boardName
    })

    return {
        ...state,
        boards: newBoards
    }

}

export default updateBoardAction;