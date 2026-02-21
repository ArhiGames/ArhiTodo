import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import type {Dispatch, SetStateAction} from "react";

interface Props {
    user: UserGetDto;
    selectedUsers: UserGetDto[];
    setSelectedUsers: Dispatch<SetStateAction<UserGetDto[]>>;
}

const DefaultUserSelectorUserComp = (props: Props) => {

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
                    <p style={{ fontWeight: "bold" }}>{props.user.userName}</p>
                </div>
                <p style={{ opacity: "75%" }}>{props.user.email}</p>
            </div>
            { isSelected && <p>✓</p> }
        </div>
    )

}

export default DefaultUserSelectorUserComp;