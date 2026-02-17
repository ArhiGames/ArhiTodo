import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import {useParams} from "react-router-dom";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";

interface Props {
    onSelected: (user: UserGetDto) => void;
    user: UserGetDto;
}

const BoardUserSelectorUserCard = (props: Props) => {

    const { appUser } = useAuth();
    const { projectId, boardId } = useParams();
    const kanbanState = useKanbanState();

    const isProjectOwner: boolean = kanbanState.projects.get(Number(projectId))?.ownedByUserId === props.user.userId;
    const isBoardOwner: boolean = kanbanState.boards.get(Number(boardId))?.ownedByUserId === props.user.userId;
    const isSelf: boolean = appUser?.id === props.user.userId;

    return (
        <div className="board-user-selector-user">
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    { isProjectOwner ? (
                        <p className="board-user-selector-user-label">Project owner</p>
                    ) : isBoardOwner ? (
                        <p className="board-user-selector-user-label">Board owner</p>
                    ) : null}
                    <p style={{ fontWeight: "bold" }}>{props.user.userName}</p>
                </div>
                <p style={{ opacity: "75%" }}>{props.user.email}</p>
            </div>
            { !isBoardOwner && !isSelf && <img onClick={() => props.onSelected(props.user)} src="/edit-icon.svg" alt="Edit" height="22px" className="icon clickable"/> }
        </div>
    )

}

export default BoardUserSelectorUserCard;