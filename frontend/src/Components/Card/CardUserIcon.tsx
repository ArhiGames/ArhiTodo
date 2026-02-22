import type {PublicUserGetDto} from "../../Models/States/KanbanState.ts";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import {useParams} from "react-router-dom";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";

interface Props {
    cardMemberId: string;
    onClick?: (element: React.MouseEvent<HTMLDivElement>) => void;
}

const CardUserIcon = ( { cardMemberId, onClick }: Props) => {

    const { boardId } = useParams();
    const { appUser } = useAuth();
    const kanbanState = useKanbanState();

    const user: PublicUserGetDto | undefined = kanbanState.boards.get(Number(boardId))?.boardMembers.find(bm => bm.userId === cardMemberId);
    if (!user) return null;

    return (
        <div onClick={onClick} className={`card-member-card ${appUser?.id === user.userId ? "self" : ""}`}>
            {user.userName.slice(0, 2)}
        </div>
    )

}

export default CardUserIcon;