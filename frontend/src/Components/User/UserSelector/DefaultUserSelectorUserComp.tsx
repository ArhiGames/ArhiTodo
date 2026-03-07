import type {Dispatch, SetStateAction} from "react";
import type {PublicUserGetDto} from "../../../Models/States/KanbanState.ts";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {matchPath} from "react-router-dom";

interface Props<T extends PublicUserGetDto> {
    user: T,
    selectedUsers: T[],
    setSelectedUsers: Dispatch<SetStateAction<T[]>>,
    userSelectorOptions: UserSelectorOptions,
    onUserSelected?: (user: T) => void,
    onUserUnselected?: (user: T) => void
}

export type UserSelectorOptions = {
    showProjectOwner: boolean;
    showBoardOwner: boolean;
    selfEditable: boolean;
}

const DefaultUserSelectorUserComp = <T extends PublicUserGetDto>(props: Props<T>) => {

    const { appUser } = useAuth();
    const kanbanState = useKanbanState();
    const match = matchPath({ path: "/projects/:projectId/board/:boardId/*" }, location.pathname);

    const isProjectOwner: boolean = kanbanState.projects.get(Number(match?.params.projectId))?.ownedByUserId === props.user.userId;
    const isBoardOwner: boolean = kanbanState.boards.get(Number(match?.params.boardId))?.ownedByUserId === props.user.userId;
    const isSelf: boolean = props.user.userId === appUser?.id;
    const isSelected: boolean = props.selectedUsers.some((selectedUser: T) => selectedUser.userId === props.user.userId);

    function onUserCompClicked() {
        if (!props.userSelectorOptions.selfEditable && isSelf) return;
        if (isSelected) {
            props.setSelectedUsers((prev: T[]) => prev.filter((user: T) => user.userId !== props.user.userId));
            if (props.onUserUnselected) {
                props.onUserUnselected(props.user)
            }
        } else {
            props.setSelectedUsers((prev: T[]) => [...prev, props.user]);
            if (props.onUserSelected) {
                props.onUserSelected(props.user);
            }
        }
    }

    return (
        <div onClick={onUserCompClicked} className="project-manager-add-user-user">
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    { isProjectOwner && props.userSelectorOptions.showProjectOwner ? (
                        <p className="user-selector-user-label">Project owner</p>
                    ) : isBoardOwner && props.userSelectorOptions.showBoardOwner ? (
                        <p className="user-selector-user-label">Board owner</p>
                    ) : null}
                    <p style={{ fontWeight: "bold" }}>{props.user.userName}</p>
                </div>
                <p style={{ opacity: "75%" }}>{props.user.email}</p>
            </div>
            { isSelected && <p>✔</p> }
        </div>
    )

}

export default DefaultUserSelectorUserComp;