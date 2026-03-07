import type {PublicUserGetDto} from "../../Models/States/KanbanState.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import "./CardUserIcon.css"

interface Props {
    user: PublicUserGetDto;
    size: "small" | "medium" | "large";
    onClick?: (element: React.MouseEvent<HTMLDivElement>) => void;
}

const CardUserIcon = (props: Props) => {

    const { appUser } = useAuth();

    return (
        <div onClick={props.onClick} className={`card-member-card ${props.size} ${appUser?.id === props.user.userId ? "self" : ""}`}>
            {props.user.userName.slice(0, 2)}
        </div>
    )

}

export default CardUserIcon;