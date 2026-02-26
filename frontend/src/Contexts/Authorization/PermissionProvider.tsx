import {type ReactNode, useReducer} from "react";
import {PermissionContext} from "./PermissionContext.ts";
import {useAuth} from "../Authentication/useAuth.ts";
import {matchPath} from "react-router-dom";
import type {Claim} from "../../Models/Claim.ts";
import {InitialUserState} from "./InitialUserState.ts";
import userReducer from "../../Reducer/userReducer.ts";
import {useKanbanState} from "../Kanban/Hooks.ts";

interface Props {
    children: ReactNode;
}

const PermissionProvider = ({ children }: Props) => {

    const { appUser, jwtPayload } = useAuth();
    const kanbanState = useKanbanState();
    const [state, dispatch] = useReducer(userReducer, InitialUserState);

    function hasModifyProjectPermission(): boolean {
        const match = matchPath({ path: "/projects/:projectId/*" }, location.pathname);
        return state.projectPermission.get(Number(match?.params.projectId))?.isManager ?? false;
    }

    function isProjectManager(): boolean {
        const match = matchPath({ path: "/projects/:projectId/*" }, location.pathname);
        return state.projectPermission.get(Number(match?.params.projectId))?.isProjectOwner ?? false;
    }

    function hasEditProjectManagerPermission(): boolean {
        return isProjectManager();
    }

    function hasCreateProjectPermission(): boolean {
        return jwtPayload?.CreateProjects === "True";
    }

    function hasEditProjectPermission(): boolean {
        return hasModifyProjectPermission();
    }

    function hasDeleteProjectPermission(): boolean {
        return isProjectManager();
    }

    function hasCreateBoardPermission(): boolean {
        return hasModifyProjectPermission();
    }

    function hasBoardPermission(boardClaim: string): boolean {
        const match = matchPath({ path: "/projects/:projectId/board/:boardId/*" }, location.pathname);

        const isProjectManager = state.projectPermission.get(Number(match?.params.projectId))?.isManager ?? false;
        const hasBoardPermission = state.boardPermissions.get(Number(match?.params.boardId))?.boardUserClaims.some(
            (buc: Claim) => buc.claimType === boardClaim && buc.claimValue === "True") ?? false;
        return isProjectManager || hasBoardPermission;
    }

    function isBoardOwner(): boolean {
        const match = matchPath({ path: "/projects/:projectId/board/:boardId/*" }, location.pathname);

        const isProjectManager = state.projectPermission.get(Number(match?.params.projectId))?.isManager ?? false;
        const isOwner = state.boardPermissions.get(Number(match?.params.boardId))?.isBoardOwner ?? false;
        return isProjectManager || isOwner;
    }

    function hasManageBoardUsersPermission(): boolean {
        return hasBoardPermission("ManageUsers");
    }

    function hasEditBoardPermission(): boolean {
        return hasBoardPermission("ManageBoard");
    }

    function hasDeleteBoardPermission(): boolean {
        return isBoardOwner();
    }

    function hasManageCardListsPermission(): boolean {
        return hasBoardPermission("ManageCardLists");
    }

    function hasManageCardsPermission(): boolean {
        return hasBoardPermission("ManageCards");
    }

    function hasEditCardStatePermission(cardId: number): boolean {
        const isAssignedCardMember: boolean = kanbanState.cards.get(cardId)?.assignedUserIds
            .some(asu => asu === appUser?.id) ?? false;
        return isAssignedCardMember || hasBoardPermission("ManageCards");
    }

    function hasManageLabelsPermission(): boolean {
        return hasBoardPermission("ManageLabels");
    }

    return (
        <PermissionContext.Provider value={{
            hasEditProjectManagerPermission,
            hasCreateProjectPermission,
            hasEditProjectPermission,
            hasDeleteProjectPermission,

            hasCreateBoardPermission,
            hasManageBoardUsersPermission,
            hasEditBoardPermission,
            hasDeleteBoardPermission,

            hasManageCardListsPermission,
            hasManageCardsPermission,
            hasEditCardStatePermission,
            hasManageLabelsPermission,

            userDispatch: dispatch
            }}>
            {children}
        </PermissionContext.Provider>
    )

}

export default PermissionProvider;