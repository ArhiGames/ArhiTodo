import type { Action } from "../Contexts/Kanban/Actions/Action.ts";
import createBoardAction from "../Contexts/Kanban/Actions/Implementation/createBoardAction.ts";
import type { State } from "../Models/States/types.ts";
import initBoardsAction from "../Contexts/Kanban/Actions/Implementation/initBoardsAction.ts";
import deleteBoardAction from "../Contexts/Kanban/Actions/Implementation/deleteBoardAction.ts";
import initBoardAction from "../Contexts/Kanban/Actions/Implementation/initBoardAction.ts";
import createCardlistAction from "../Contexts/Kanban/Actions/Implementation/createCardlistAction.ts";
import createBoardSucceededAction from "../Contexts/Kanban/Actions/Implementation/createBoardSucceededAction.ts";
import createCardlistSucceededAction from "../Contexts/Kanban/Actions/Implementation/createCardlistSucceededAction.ts";
import deleteCardlistAction from "../Contexts/Kanban/Actions/Implementation/deleteCardlistAction.ts";

function rootReducer(state: State, action: Action) {
    switch (action.type) {
        case "INIT_BOARDS":
            return initBoardsAction(state, action.payload);
        case "INIT_BOARD":
            return initBoardAction(state, action.payload);
        case "CREATE_BOARD_OPTIMISTIC":
            return createBoardAction(state, action.payload);
        case "CREATE_BOARD_SUCCEEDED":
            return createBoardSucceededAction(state, action.payload);
        case "CREATE_BOARD_FAILED":
            return deleteBoardAction(state, action.payload.failedBoardId);
        case "CREATE_CARDLIST_OPTIMISTIC":
            return createCardlistAction(state, action.payload);
        case "CREATE_CARDLIST_SUCCEEDED":
            return createCardlistSucceededAction(state, action.payload);
        case "CREATE_CARDLIST_FAILED":
            return deleteCardlistAction(state, action.payload.failedCardlistId);
    }
}

export default rootReducer;