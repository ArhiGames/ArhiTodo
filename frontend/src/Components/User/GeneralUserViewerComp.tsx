import type {PublicUserGetDto} from "../../Models/States/KanbanState.ts";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import {matchPath} from "react-router-dom";

interface Props {
    user: PublicUserGetDto;
    options: UserViewerOptions;
}

export type UserViewerOptions = {
    showProjectOwner: boolean;
    showBoardOwner: boolean;
}


const GeneralUserViewerComp = (props: Props) => {

    const kanbanState = useKanbanState();
    const match = matchPath({ path: "/projects/:projectId/board/:boardId/*" }, location.pathname);

    const isProjectOwner: boolean = kanbanState.projects.get(Number(match?.params.projectId))?.ownedByUserId === props.user.userId;
    const isProjectManager: boolean = kanbanState.projects.get(Number(match?.params.projectId))
        ?.projectManagers.some((projectManager: PublicUserGetDto) => projectManager.userId === props.user.userId) ?? false;
    const isBoardOwner: boolean = kanbanState.boards.get(Number(match?.params.boardId))?.ownedByUserId === props.user.userId;

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                { isProjectOwner && props.options.showProjectOwner ? (
                    <p className="user-selector-user-label">Project owner</p>
                ) : isProjectManager && props.options.showProjectOwner ? (
                    <p className="user-selector-user-label">Project manager</p>
                ) : isBoardOwner && props.options.showBoardOwner ? (
                    <p className="user-selector-user-label">Board owner</p>
                ) : null}
                <p style={{ fontWeight: "bold" }}>{props.user.userName}</p>
            </div>
            <p style={{ opacity: "75%" }}>{props.user.email}</p>
        </div>
    )

}

export default GeneralUserViewerComp;