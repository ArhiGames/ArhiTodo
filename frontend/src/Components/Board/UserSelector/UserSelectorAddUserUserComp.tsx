import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import type {Dispatch, SetStateAction} from "react";
import {useParams} from "react-router-dom";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";

interface Props {
    user: UserGetDto;
    isBoardMember: boolean;
    updatedUsers: { userId: string, newMemberState: boolean }[];
    setUpdatedUsers: Dispatch<SetStateAction<{ userId: string, newMemberState: boolean }[]>>
}

const UserSelectorAddUserUserComp = (props: Props) => {

    const { projectId, boardId } = useParams();
    const kanbanState = useKanbanState();

    const isProjectOwner: boolean = kanbanState.projects[Number(projectId)].ownedByUserId === props.user.userId;
    const isBoardOwner: boolean = kanbanState.boards[Number(boardId)].ownedByUserId === props.user.userId;

    function handleClicked() {
        if (props.updatedUsers.some((updatedUser: { userId: string, newMemberState: boolean } ) => updatedUser.userId === props.user.userId)) {
            props.setUpdatedUsers(props.updatedUsers.filter((updatedUser: { userId: string, newMemberState: boolean }) => updatedUser.userId !== props.user.userId));
        } else {
            props.setUpdatedUsers([...props.updatedUsers, { userId: props.user.userId, newMemberState: !props.isBoardMember }]);
        }
    }

    function shouldMarkAsMember(): boolean {
        const isOnUpdatedList = props.updatedUsers.some((updatedUser: { userId: string, newMemberState: boolean } ) =>
            updatedUser.userId === props.user.userId);
        if (isOnUpdatedList) {
            return !props.isBoardMember;
        }

        return props.isBoardMember;
    }

    return (
        <div onClick={handleClicked} className="user-selector-add-user-user">
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    { isProjectOwner ? (
                        <p className="user-selector-user-label">Project owner</p>
                    ) : isBoardOwner ? (
                        <p className="user-selector-user-label">Board owner</p>
                    ) : null}
                    <p style={{ fontWeight: "bold" }}>{props.user.userName}</p>
                </div>
                <p style={{ opacity: "75%" }}>{props.user.email}</p>
            </div>
            { shouldMarkAsMember() && <p>✓</p> }
        </div>
    )

}

export default UserSelectorAddUserUserComp