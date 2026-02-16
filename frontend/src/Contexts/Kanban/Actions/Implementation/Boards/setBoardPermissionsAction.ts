import type {State} from "../../../../../Models/States/types.ts";
import type {SetBoardPermissionsPayload} from "../../Action.ts";

const setBoardPermissionsAction = (state: State, payload: SetBoardPermissionsPayload): State => {

    return {
        ...state,
        boardUserClaims: {
            ...state.boardUserClaims,
            [payload.boardId]: payload.boardUserClaims
        }
    }

}

export default setBoardPermissionsAction;