import {createContext, type Dispatch} from "react";
import type {UserAction} from "./Actions/userAction.ts";

export type PermissionContextType = {
    hasEditProjectManagerPermission: () => boolean;
    hasCreateProjectPermission: () => boolean;
    hasEditProjectPermission: () => boolean;
    hasDeleteProjectPermission: () => boolean;

    hasCreateBoardPermission: () => boolean;
    hasManageBoardUsersPermission: () => boolean;
    hasEditBoardPermission: () => boolean;
    hasDeleteBoardPermission: () => boolean;

    hasManageCardListsPermission: () => boolean;
    hasManageCardsPermission: () => boolean;
    hasEditCardStatePermission: (cardId: number) => boolean;
    hasManageLabelsPermission: () => boolean;
    
    userDispatch: Dispatch<UserAction> | undefined;
}

export const PermissionContext = createContext<PermissionContextType>({
    hasEditProjectManagerPermission: () => false,
    hasCreateProjectPermission: () => false,
    hasEditProjectPermission: () => false,
    hasDeleteProjectPermission: () => false,

    hasCreateBoardPermission: () => false,
    hasManageBoardUsersPermission: () => false,
    hasEditBoardPermission: () => false,
    hasDeleteBoardPermission: () => false,

    hasManageCardListsPermission: () => false,
    hasManageCardsPermission: () => false,
    hasEditCardStatePermission: () => false,
    hasManageLabelsPermission: () => false,
    
    userDispatch: undefined
})