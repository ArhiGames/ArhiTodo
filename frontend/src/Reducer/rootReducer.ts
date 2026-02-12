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
import updateLabelAction from "../Contexts/Kanban/Actions/Implementation/Labels/updateLabelAction.ts";
import addLabelToCard from "../Contexts/Kanban/Actions/Implementation/Labels/addLabelToCard.ts";
import removeLabelFromCard from "../Contexts/Kanban/Actions/Implementation/Labels/removeLabelFromCard.ts";
import updateCardNameAction from "../Contexts/Kanban/Actions/Implementation/Card/updateCardNameAction.ts";
import updateCardStateAction from "../Contexts/Kanban/Actions/Implementation/Card/updateCardStateAction.ts";
import createChecklistAction from "../Contexts/Kanban/Actions/Implementation/Checklist/createChecklistAction.ts";
import deleteChecklistAction from "../Contexts/Kanban/Actions/Implementation/Checklist/deleteChecklistAction.ts";
import createChecklistSucceededAction
    from "../Contexts/Kanban/Actions/Implementation/Checklist/createChecklistSucceededAction.ts";
import changeChecklistItemStateAction
    from "../Contexts/Kanban/Actions/Implementation/Checklist/changeChecklistItemStateAction.ts";
import createChecklistItemAction
    from "../Contexts/Kanban/Actions/Implementation/Checklist/createChecklistItemAction.ts";
import deleteChecklistItemAction
    from "../Contexts/Kanban/Actions/Implementation/Checklist/deleteChecklistItemAction.ts";
import createChecklistItemSucceededAction
    from "../Contexts/Kanban/Actions/Implementation/Checklist/createChecklistItemSucceededAction.ts";
import updateChecklistItemAction
    from "../Contexts/Kanban/Actions/Implementation/Checklist/updateChecklistItemAction.ts";
import updateChecklistAction from "../Contexts/Kanban/Actions/Implementation/Checklist/updateChecklistAction.ts";
import updateCardlistAction from "../Contexts/Kanban/Actions/Implementation/Cardlists/updateCardlistAction.ts";
import removeCardsFromCardlistAction
    from "../Contexts/Kanban/Actions/Implementation/Cardlists/removeCardsFromCardlistAction.ts";
import initProjectAction from "../Contexts/Kanban/Actions/Implementation/Projects/initProjectAction.ts";
import initProjectsAction from "../Contexts/Kanban/Actions/Implementation/Projects/initProjectsAction.ts";
import updateProjectAction from "../Contexts/Kanban/Actions/Implementation/Projects/updateProjectAction.ts";
import deleteProjectAction from "../Contexts/Kanban/Actions/Implementation/Projects/deleteProjectAction.ts";
import setProjectPermissionAction
    from "../Contexts/Kanban/Actions/Implementation/Projects/setProjectPermissionAction.ts";

function rootReducer(state: State, action: Action): State {
    switch (action.type) {
        case "INIT_PROJECTS":
            return initProjectsAction(state, action.payload);
        case "INIT_PROJECT":
            return initProjectAction(state, action.payload);
        case "UPDATE_PROJECT":
            return updateProjectAction(state, action.payload);
        case "DELETE_PROJECT":
            return deleteProjectAction(state, action.payload.projectId);
        case "SET_PROJECT_PERMISSION":
            return setProjectPermissionAction(state, action.payload);

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
        case "UPDATE_LABEL":
            return updateLabelAction(state, action.payload);
        case "DELETE_LABEL":
            return deleteLabelAction(state, { labelToDelete: action.payload.labelId });

        case "ADD_LABEL_TO_CARD_OPTIMISTIC":
            return addLabelToCard(state, action.payload);
        case "ADD_LABEL_TO_CARD_FAILED":
            return removeLabelFromCard(state, action.payload);
        case "REMOVE_LABEL_FROM_CARD":
            return removeLabelFromCard(state, action.payload);

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
        case "DELETE_CARDLIST":
            return deleteCardlistAction(state, action.payload.cardListId);
        case "DELETE_CARDS_FROM_CARDLIST":
            return removeCardsFromCardlistAction(state, action.payload.fromCardListId);
        case "UPDATE_CARDLIST":
            return updateCardlistAction(state, action.payload);

        case "CREATE_CARD_OPTIMISTIC":
            return createCardAction(state, action.payload);
        case "CREATE_CARD_SUCCEEDED":
            return createCardSucceededAction(state, action.payload);
        case "CREATE_CARD_FAILED":
            return deleteCardAction(state, action.payload.failedCardId);
        case "UPDATE_CARD_NAME":
            return updateCardNameAction(state, action.payload);
        case "UPDATE_CARD_STATE":
            return updateCardStateAction(state, action.payload);
        case "DELETE_CARD":
            return deleteCardAction(state, action.payload.cardId);

        case "CREATE_CHECKLIST_OPTIMISTIC":
            return createChecklistAction(state, action.payload);
        case "CREATE_CHECKLIST_SUCCEEDED":
            return createChecklistSucceededAction(state, action.payload);
        case "UPDATE_CHECKLIST":
            return updateChecklistAction(state, action.payload);
        case "DELETE_CHECKLIST":
            return deleteChecklistAction(state, action.payload);

        case "CREATE_CHECKLIST_ITEM_OPTIMISTIC":
            return createChecklistItemAction(state, action.payload);
        case "CREATE_CHECKLIST_ITEM_SUCCEEDED":
            return createChecklistItemSucceededAction(state, action.payload);
        case "DELETE_CHECKLIST_ITEM":
            return deleteChecklistItemAction(state, action.payload);
        case "UPDATE_CHECKLIST_ITEM":
            return updateChecklistItemAction(state, action.payload);
        case "CHANGE_CHECKLIST_ITEM_STATE":
            return changeChecklistItemStateAction(state, action.payload);
    }
}

export default rootReducer;