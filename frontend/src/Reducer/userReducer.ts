import type {UserAction} from "../Contexts/Authorization/Actions/userAction.ts";
import setProjectPermissionAction
    from "../Contexts/Authorization/Actions/Implementations/setProjectPermissionAction.ts";
import setBoardPermissionsAction from "../Contexts/Authorization/Actions/Implementations/setBoardPermissionsAction.ts";
import type {UserState} from "../Models/States/UserState.ts";

function userReducer(userState: UserState, action: UserAction): UserState {
    switch (action.type) {
        case "SET_PROJECT_PERMISSION":
            return setProjectPermissionAction(userState, action.payload);
        case "SET_BOARD_PERMISSION":
            return setBoardPermissionsAction(userState, action.payload);
    }
}

export default userReducer;