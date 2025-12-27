import type { State } from "../../../../../Models/States/types.ts";
import type { CreateBoardPayload } from "../../Action.ts";

const createBoardAction = (state: State, payload: CreateBoardPayload) => {

    console.log(payload);

    return {
        ...state,
        boards: {
            ...state.boards,
            [payload.boardId]: {
                ...state.boards[payload.boardId],
                projectId: payload.projectId,
                boardId: payload.boardId,
                boardName: payload.boardName
            }
        }
    }

}

export default createBoardAction;