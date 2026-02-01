import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import type {Dispatch, SetStateAction} from "react";

interface Props {
    user: UserGetDto;
    isBoardMember: boolean;
    updatedUsers: { userId: string, newMemberState: boolean }[];
    setUpdatedUsers: Dispatch<SetStateAction<{ userId: string, newMemberState: boolean }[]>>
}

const UserSelectorAddUserUserComp = (props: Props) => {

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
                <p style={{ fontWeight: "bold" }}>{props.user.userName}</p>
                <p style={{ opacity: "75%" }}>{props.user.email}</p>
            </div>
            { shouldMarkAsMember() && <p>✓</p> }
        </div>
    )

}

export default UserSelectorAddUserUserComp