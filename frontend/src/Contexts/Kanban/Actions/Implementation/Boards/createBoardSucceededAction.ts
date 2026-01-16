import type { State } from "../../../../../Models/States/types.ts";
import type {CreateBoardSucceededPayload} from "../../Action.ts";

const createBoardSucceededAction = (state: State, payload: CreateBoardSucceededPayload) => {

    const { [payload.predictedBoardId]: boardToUpdate, ...restBoards } = state.boards;

    return {
        ...state,
        boards: {
            ...restBoards,
            [payload.actualBoardId]: {
                ...boardToUpdate,
                boardId: payload.actualBoardId,
            }
        }
    }

}

export default createBoardSucceededAction;