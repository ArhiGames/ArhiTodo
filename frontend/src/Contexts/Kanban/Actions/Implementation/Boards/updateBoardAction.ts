import type { State } from "../../../../../Models/States/types.ts";
import type { UpdateBoardPayload } from "../../Action.ts";

const updateBoardAction = (state: State, payload: UpdateBoardPayload) => {

    return {
        ...state,
        boards: {
            ...state.boards,
            [payload.boardId]: {
                ...state.boards[payload.boardId],
                boardName: payload.boardName
            }
        }
    }

}

export default updateBoardAction;