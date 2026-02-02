import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import {type Dispatch, type SetStateAction} from "react";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {matchPath} from "react-router-dom";

interface Props {
    user: UserGetDto;
    selectedUsers: UserGetDto[];
    setSelectedUsers: Dispatch<SetStateAction<UserGetDto[]>>;
}

const ProjectManagerAddUserComp = (props: Props) => {

    const match = matchPath({ path: "/projects/:projectId/*" }, location.pathname);
    const kanbanState = useKanbanState();

    const isProjectOwner: boolean = kanbanState.projects[Number(match?.params.projectId)]?.ownedByUserId === props.user.userId;
    const isSelected: boolean = props.selectedUsers.some((selectedUser: UserGetDto) => selectedUser.userId === props.user.userId);

    function onUserCompClicked() {
        if (isSelected) {
            props.setSelectedUsers(props.selectedUsers.filter((user: UserGetDto) => user.userId !== props.user.userId));
        } else {
            props.setSelectedUsers([...props.selectedUsers, props.user]);
        }
    }

    return (
        <div onClick={onUserCompClicked} className="project-manager-add-user-user">
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    { isProjectOwner && <p className="project-manager-add-user-label">Project owner</p> }
                    <p style={{ fontWeight: "bold" }}>{props.user.userName}</p>
                </div>
                <p style={{ opacity: "75%" }}>{props.user.email}</p>
            </div>
            { isSelected && <p>✓</p> }
        </div>
    )

}

export default ProjectManagerAddUserComp;