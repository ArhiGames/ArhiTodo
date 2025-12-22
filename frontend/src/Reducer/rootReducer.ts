import type { Action } from "../Contexts/Kanban/Actions/Action.ts";
import createBoardAction from "../Contexts/Kanban/Actions/Implementation/createBoardAction.ts";
import type { State } from "../Models/States/types.ts";
import initBoardsAction from "../Contexts/Kanban/Actions/Implementation/initBoardsAction.ts";
import deleteBoardAction from "../Contexts/Kanban/Actions/Implementation/deleteBoardAction.ts";
import initBoardAction from "../Contexts/Kanban/Actions/Implementation/initBoardAction.ts";
import createCardlistAction from "../Contexts/Kanban/Actions/Implementation/createCardlistAction.ts";

function rootReducer(state: State, action: Action) {
    switch (action.type) {
        case "INIT_BOARDS":
            return initBoardsAction(action.payload);
        case "INIT_BOARD":
            return initBoardAction(state, action.payload);
        case "CREATE_BOARD_OPTIMISTIC":
            return createBoardAction(state, action.payload);
        case "CREATE_BOARD_FAILED":
            return deleteBoardAction(state, action.payload.failedBoardId);
        case "CREATE_CARDLIST_OPTIMISTIC":
            return createCardlistAction(state, action.payload);
    }
}

export default rootReducer;