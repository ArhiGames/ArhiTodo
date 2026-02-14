import {createContext} from "react";

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
    hasManageLabelsPermission: () => boolean;
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
    hasManageLabelsPermission: () => false,
})