import type {Board, Card, Project, PublicUserGetDto} from "../../Models/States/KanbanState.ts";
import CardUserIcon from "../User/CardUserIcon.tsx";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import {useParams} from "react-router-dom";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";

interface Props {
    onClicked?: (e: React.MouseEvent<HTMLDivElement>) => void;
    cardId: number;
    maxUserIconsToShow?: number;
}

const CardMembersListComp = (props: Props) => {

    const kanbanState = useKanbanState();
    const { projectId, boardId } = useParams();
    const { appUser } = useAuth();

    const card: Card | undefined = kanbanState.cards.get(props.cardId);
    if (!card) return null;

    function getCurrentSelectedStateUsers() {
        const project: Project | undefined = kanbanState.projects.get(Number(projectId));
        const board: Board | undefined = kanbanState.boards.get(Number(boardId));

        if (!card || !board) return [];

        return card.assignedUserIds
            .map(assignedUserId => board.boardMembers.find(bm => bm.userId === assignedUserId) ||
                                                                  project?.projectManagers.find(pm => pm.userId === assignedUserId))
            .filter((bm): bm is PublicUserGetDto => !!bm)
            .sort((a: PublicUserGetDto, b: PublicUserGetDto) => {
                if (a.userId === appUser?.id) return -1;
                if (b.userId === appUser?.id) return 1;
                return 0;
            });
    }

    return (
        <>
            { getCurrentSelectedStateUsers().slice(0, props.maxUserIconsToShow).map((user: PublicUserGetDto) => {
                return <CardUserIcon onClick={props.onClicked} size="small" key={user.userId} user={user}/>
            }) }
            { props.maxUserIconsToShow && card.assignedUserIds.length - props.maxUserIconsToShow > 0 && (
                <div onClick={props.onClicked} className="card-member-card small">+{card.assignedUserIds.length - props.maxUserIconsToShow}</div>
            )}
        </>
    )

}

export default CardMembersListComp;