import type { State } from "../../../../Models/States/types.ts";
import type { CreateBoardSucceededPayload } from "../Action.ts";

const createBoardSucceededAction = (state: State, payload: CreateBoardSucceededPayload) => {

    return {
        ...state,
        boards: {
            ...state.boards,
            [payload.predictedBoardId]: {
                ...state.boards[payload.predictedBoardId],
                boardId: payload.actualBoardId,
            }
        }
    }

}

export default createBoardSucceededAction;