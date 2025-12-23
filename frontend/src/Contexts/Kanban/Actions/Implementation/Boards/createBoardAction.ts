import type { State } from "../../../../../Models/States/types.ts";
import type { CreateBoardPayload } from "../../Action.ts";

const createBoardAction = (state: State, payload: CreateBoardPayload) => {
    
    return {
        ...state,
        boards: {
            ...state.boards,
            [payload.boardId]: {
                boardId: payload.boardId,
                boardName: payload.boardName
            }
        }
    }

}

export default createBoardAction;