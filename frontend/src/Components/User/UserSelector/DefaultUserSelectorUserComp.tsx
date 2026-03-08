import type {Dispatch, SetStateAction} from "react";
import type {PublicUserGetDto} from "../../../Models/States/KanbanState.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import GeneralUserViewerComp, {type UserViewerOptions} from "../GeneralUserViewerComp.tsx";

interface Props<T extends PublicUserGetDto> {
    user: T,
    selectedUsers: T[],
    setSelectedUsers: Dispatch<SetStateAction<T[]>>,
    userSelectorOptions: UserViewerOptions,
    selfEditable?: boolean,
    onUserSelected?: (user: T) => void,
    onUserUnselected?: (user: T) => void
}

const DefaultUserSelectorUserComp = <T extends PublicUserGetDto>(props: Props<T>) => {

    const { appUser } = useAuth();

    const isSelf: boolean = props.user.userId === appUser?.id;
    const isSelected: boolean = props.selectedUsers.some((selectedUser: T) => selectedUser.userId === props.user.userId);

    function onUserCompClicked() {
        if (!props.selfEditable && isSelf) return;
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
        <div onClick={onUserCompClicked} className="default-user-selector">
            <GeneralUserViewerComp user={props.user} options={props.userSelectorOptions}/>
            { isSelected && <p>✔</p> }
        </div>
    )

}

export default DefaultUserSelectorUserComp;