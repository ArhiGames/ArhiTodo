import type {BoardPermission, UserState} from "../../../../Models/States/UserState.ts";
import type {SetBoardPermissionsPayload} from "../userAction.ts";

const setBoardPermissionsAction = (state: UserState, payload: SetBoardPermissionsPayload): UserState => {

    const newBoardPermissions: Map<number, BoardPermission> = new Map(state.boardPermissions);
    newBoardPermissions.set(payload.boardId, {
        boardId: payload.boardId,
        isBoardOwner: payload.isOwner,
        boardUserClaims: payload.boardUserClaims
    });

    return {
        ...state,
        boardPermissions: newBoardPermissions
    }

}

export default setBoardPermissionsAction;