import type { Action } from "../Contexts/Kanban/Actions/Action.ts";
import createBoardAction from "../Contexts/Kanban/Actions/Implementation/Boards/createBoardAction.ts";
import type { State } from "../Models/States/types.ts";
import initBoardsAction from "../Contexts/Kanban/Actions/Implementation/initBoardsAction.ts";
import deleteBoardAction from "../Contexts/Kanban/Actions/Implementation/Boards/deleteBoardAction.ts";
import initBoardAction from "../Contexts/Kanban/Actions/Implementation/initBoardAction.ts";
import createCardlistAction from "../Contexts/Kanban/Actions/Implementation/Cardlists/createCardlistAction.ts";
import createBoardSucceededAction from "../Contexts/Kanban/Actions/Implementation/Boards/createBoardSucceededAction.ts";
import createCardlistSucceededAction from "../Contexts/Kanban/Actions/Implementation/Cardlists/createCardlistSucceededAction.ts";
import deleteCardlistAction from "../Contexts/Kanban/Actions/Implementation/Cardlists/deleteCardlistAction.ts";
import createCardAction from "../Contexts/Kanban/Actions/Implementation/Card/createCardAction.ts";
import createCardSucceededAction from "../Contexts/Kanban/Actions/Implementation/Card/createCardSucceededAction.ts";
import deleteCardAction from "../Contexts/Kanban/Actions/Implementation/Card/deleteCardAction.ts";
import updateBoardAction from "../Contexts/Kanban/Actions/Implementation/Boards/updateBoardAction.ts";
import createLabelAction from "../Contexts/Kanban/Actions/Implementation/Labels/createLabelAction.ts";
import createLabelSucceededAction
    from "../Contexts/Kanban/Actions/Implementation/Labels/createLabelSucceededAction.tsx";
import deleteLabelAction from "../Contexts/Kanban/Actions/Implementation/Labels/deleteLabelAction.ts";

function rootReducer(state: State, action: Action) {
    switch (action.type) {
        case "INIT_BOARDS":
            return initBoardsAction(state, action.payload);
        case "INIT_BOARD":
            return initBoardAction(state, action.payload);

        case "CREATE_LABEL_OPTIMISTIC":
            return createLabelAction(state, action.payload);
        case "CREATE_LABEL_SUCCEEDED":
            return createLabelSucceededAction(state, action.payload);
        case "CREATE_LABEL_FAILED":
            return deleteLabelAction(state, action.payload);
        case "DELETE_LABEL":
            return deleteLabelAction(state, { failedLabelId: action.payload.labelId });

        case "CREATE_BOARD_OPTIMISTIC":
            return createBoardAction(state, action.payload);
        case "CREATE_BOARD_SUCCEEDED":
            return createBoardSucceededAction(state, action.payload);
        case "CREATE_BOARD_FAILED":
            return deleteBoardAction(state, action.payload.failedBoardId);

        case "UPDATE_BOARD":
            return updateBoardAction(state, action.payload);
        case "DELETE_BOARD":
            return deleteBoardAction(state, action.payload.boardId)

        case "CREATE_CARDLIST_OPTIMISTIC":
            return createCardlistAction(state, action.payload);
        case "CREATE_CARDLIST_SUCCEEDED":
            return createCardlistSucceededAction(state, action.payload);
        case "CREATE_CARDLIST_FAILED":
            return deleteCardlistAction(state, action.payload.failedCardlistId);

        case "CREATE_CARD_OPTIMISTIC":
            return createCardAction(state, action.payload);
        case "CREATE_CARD_SUCCEEDED":
            return createCardSucceededAction(state, action.payload);
        case "CREATE_CARD_FAILED":
            return deleteCardAction(state, action.payload.failedCardId);
    }
}

export default rootReducer;