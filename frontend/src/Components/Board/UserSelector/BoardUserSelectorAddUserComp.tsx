import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import type {Dispatch, SetStateAction} from "react";
import {useParams} from "react-router-dom";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";

interface Props {
    user: UserGetDto;
    selectedUsers: UserGetDto[];
    setSelectedUsers: Dispatch<SetStateAction<UserGetDto[]>>;
}

const BoardUserSelectorAddUserComp = (props: Props) => {

    const { projectId, boardId } = useParams();
    const kanbanState = useKanbanState();

    const isProjectOwner: boolean = kanbanState.projects[Number(projectId)].ownedByUserId === props.user.userId;
    const isBoardOwner: boolean = kanbanState.boards[Number(boardId)].ownedByUserId === props.user.userId;
    const isSelected: boolean = props.selectedUsers.some((selectedUser: UserGetDto) => selectedUser.userId === props.user.userId);

    function handleClicked() {
        if (isSelected) {
            props.setSelectedUsers(props.selectedUsers.filter((selectedUser: UserGetDto) => selectedUser.userId !== props.user.userId));
        } else {
            props.setSelectedUsers([...props.selectedUsers, props.user]);
        }
    }

    return (
        <div onClick={handleClicked} className="board-user-selector-add-user-user">
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
            { isSelected && <p>✓</p> }
        </div>
    )

}

export default BoardUserSelectorAddUserComp