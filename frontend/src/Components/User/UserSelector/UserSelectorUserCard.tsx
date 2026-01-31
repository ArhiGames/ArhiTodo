import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";

interface Props {
    onSelected: (user: UserGetDto) => void;
    user: UserGetDto;
}

const UserSelectorUserCard = (props: Props) => {

    return (
        <div className="user-selector-user">
            <div>
                <p style={{ fontWeight: "bold" }}>{props.user.userName}</p>
                <p style={{ opacity: "75%" }}>{props.user.email}</p>
            </div>
            <img onClick={() => props.onSelected(props.user)} src="/edit-icon.svg" alt="Edit" height="22px" className="icon clickable"/>
        </div>
    )

}

export default UserSelectorUserCard;