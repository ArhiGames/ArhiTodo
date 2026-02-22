import type {Dispatch, SetStateAction} from "react";
import type {PublicUserGetDto} from "../../../Models/States/KanbanState.ts";

interface Props {
    user: PublicUserGetDto,
    selectedUsers: PublicUserGetDto[],
    setSelectedUsers: Dispatch<SetStateAction<PublicUserGetDto[]>>,
    onUserSelected?: (user: PublicUserGetDto) => void,
    onUserUnselected?: (user: PublicUserGetDto) => void
}

const DefaultUserSelectorUserComp = (props: Props) => {

    const isSelected: boolean = props.selectedUsers.some((selectedUser: PublicUserGetDto) => selectedUser.userId === props.user.userId);

    function onUserCompClicked() {
        if (isSelected) {
            props.setSelectedUsers((prev: PublicUserGetDto[]) => prev.filter((user: PublicUserGetDto) => user.userId !== props.user.userId));
            if (props.onUserUnselected) {
                props.onUserUnselected(props.user)
            }
        } else {
            props.setSelectedUsers((prev: PublicUserGetDto[]) => [...prev, props.user]);
            if (props.onUserSelected) {
                props.onUserSelected(props.user);
            }
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