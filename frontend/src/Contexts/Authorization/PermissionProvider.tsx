import type {ReactNode} from "react";
import {PermissionContext} from "./PermissionContext.ts";
import {useAuth} from "../Authentication/useAuth.ts";
import {useKanbanState} from "../Kanban/Hooks.ts";
import {matchPath} from "react-router-dom";
import type {Claim} from "../../Models/Claim.ts";

interface Props {
    children: ReactNode;
}

const PermissionProvider = ({ children }: Props) => {

    const { jwtPayload, appUser } = useAuth();
    const kanbanState = useKanbanState();

    function hasModifyProjectPermission(): boolean {
        const match = matchPath({ path: "/projects/:projectId/*" }, location.pathname);
        const hasPermissionGlobally = jwtPayload?.ModifyOthersProjects === "true";
        const isProjectManager = kanbanState.projectPermission[Number(match?.params.projectId)]?.isManager;
        return hasPermissionGlobally || isProjectManager;
    }

    function isProjectManager(): boolean {
        const match = matchPath({ path: "/projects/:projectId/*" }, location.pathname);
        const mayModifyOthersProjectsGlobally = jwtPayload?.ModifyOthersProjects === "true";
        const isProjectOwner = kanbanState.projects[Number(match?.params.projectId)]?.ownedByUserId === appUser?.id;
        return mayModifyOthersProjectsGlobally || isProjectOwner;
    }

    function hasEditProjectManagerPermission(): boolean {
        return isProjectManager();
    }

    function hasCreateProjectPermission(): boolean {
        return jwtPayload?.CreateProjects === "true";
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

        const hasPermissionGlobally = jwtPayload?.ModifyOthersProjects === "true";
        const isProjectManager = kanbanState.projectPermission[Number(match?.params.projectId)]?.isManager;
        const hasBoardPermission = kanbanState.boardUserClaims[Number(match?.params.boardId)]
            ?.some((buc: Claim) => buc.claimType === boardClaim && buc.claimValue === "true");
        return hasPermissionGlobally || isProjectManager || hasBoardPermission;
    }

    function isBoardOwner(): boolean {
        const match = matchPath({ path: "/projects/:projectId/board/:boardId/*" }, location.pathname);

        const hasGlobalPermission = jwtPayload?.ModifyOthersProjects === "true";
        const isProjectManager = kanbanState.projectPermission[Number(match?.params.projectId)]?.isManager;
        const isOwner = kanbanState.boards[Number(match?.params.boardId)].ownedByUserId === appUser?.id;
        return hasGlobalPermission || isProjectManager || isOwner;
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
            hasManageLabelsPermission,
            }}>
            {children}
        </PermissionContext.Provider>
    )

}

export default PermissionProvider;