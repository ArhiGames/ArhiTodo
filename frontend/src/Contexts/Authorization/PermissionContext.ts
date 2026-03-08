import {createContext, type Dispatch} from "react";
import type {UserAction} from "./Actions/userAction.ts";

export type PermissionContextType = {
    hasAccessAdminDashboardPermission: () => boolean;

    hasEditProjectManagerPermission: () => boolean;
    hasCreateProjectPermission: () => boolean;
    hasEditProjectPermission: () => boolean;
    hasDeleteProjectPermission: () => boolean;

    hasCreateBoardPermission: () => boolean;
    hasManageBoardUsersPermission: () => boolean;
    hasEditBoardPermission: (boardId?: number) => boolean;
    hasDeleteBoardPermission: (boardId?: number) => boolean;

    hasManageCardListsPermission: () => boolean;
    hasManageCardsPermission: () => boolean;
    hasEditCardStatePermission: (cardId: number) => boolean;
    hasManageLabelsPermission: () => boolean;
    
    userDispatch: Dispatch<UserAction> | undefined;
}

export const PermissionContext = createContext<PermissionContextType>({
    hasAccessAdminDashboardPermission: () => false,

    hasEditProjectManagerPermission: () => false,
    hasCreateProjectPermission: () => false,
    hasEditProjectPermission: () => false,
    hasDeleteProjectPermission: () => false,

    hasCreateBoardPermission: () => false,
    hasManageBoardUsersPermission: () => false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasEditBoardPermission: (_boardId?: number) => false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    hasDeleteBoardPermission: (_boardId?: number) => false,

    hasManageCardListsPermission: () => false,
    hasManageCardsPermission: () => false,
    hasEditCardStatePermission: () => false,
    hasManageLabelsPermission: () => false,
    
    userDispatch: undefined
})