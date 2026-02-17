import type {State} from "../../../../../Models/States/types.ts";
import type {SetBoardPermissionsPayload} from "../../Action.ts";
import type {Claim} from "../../../../../Models/Claim.ts";

const setBoardPermissionsAction = (state: State, payload: SetBoardPermissionsPayload): State => {

    const newBoardUserClaims: Map<number, Claim[]> = new Map(state.boardUserClaims);
    newBoardUserClaims.set(payload.boardId, [
        ...payload.boardUserClaims
    ]);

    return {
        ...state,
        boardUserClaims: newBoardUserClaims
    }

}

export default setBoardPermissionsAction;