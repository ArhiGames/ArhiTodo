import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import BoardUserSelector from "../UserSelector/BoardUserSelector.tsx";
import {useRef, useState} from "react";
import type {Board, Project, PublicUserGetDto} from "../../../Models/States/KanbanState.ts";
import CardUserIcon from "../../User/CardUserIcon.tsx";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {useParams} from "react-router-dom";
import {useCardsSearch} from "../../../Contexts/Kanban/Cards/SearchCardsContexts.ts";

const UserViewerCompFooter = ({ user, close }: { user: PublicUserGetDto, close: () => void }) => {

    const cardSearch = useCardsSearch();

    function onViewUserClick() {
        cardSearch.setFilteringUserIds((prev: string[]) => [...prev, user.userId]);
        close();
    }

    return (
        <div className="user-viewer-filter-footer-div">
            <button className="button standard-button" onClick={onViewUserClick}>Show cards with user</button>
        </div>
    )

}

const BoardCompHeaderMembersComp = () => {

    const kanbanState = useKanbanState();
    const { appUser } = useAuth();
    const { projectId, boardId } = useParams();
    const permissions = usePermissions();
    const searchCards = useCardsSearch();

    const boardMembersButtonRef = useRef<HTMLImageElement>(null);
    const [isEditingMembers, setIsEditingMembers] = useState<boolean>(false);

    function onUserIconPressed(user: PublicUserGetDto) {
        searchCards.setFilteringUserIds((prev: string[]) => prev.filter((userId: string) => user.userId !== userId));
    }

    function canViewDetails(user: PublicUserGetDto): boolean {
        return !searchCards.filteringUserIds.includes(user.userId);
    }

    function getMembersJsx() {

        const project: Project | undefined = kanbanState.projects.get(Number(projectId));
        const board: Board | undefined = kanbanState.boards.get(Number(boardId));
        if (!project || !board) return [];

        const members: PublicUserGetDto[] = [];
        for (const projectManager of project.projectManagers) {
            members.push(projectManager);
        }
        for (const boardMember of board.boardMembers) {
            if (!members.some((addedMember: PublicUserGetDto) => addedMember.userId === boardMember.userId)) {
                members.push(boardMember);
            }
        }
        members.sort((a: PublicUserGetDto, b: PublicUserGetDto) => {
            if (a.userId === appUser?.id) return -1;
            if (b.userId === appUser?.id) return 1;
            return 0;
        });

        const remainingBoardMembers: number = members.length - 6;
        return (
            <div className="board-members">
                {members.slice(0, 6).map((boardMember: PublicUserGetDto) => {
                    return <CardUserIcon key={boardMember.userId} canViewDetails={canViewDetails} size="medium" user={boardMember}
                                         onClick={() => onUserIconPressed(boardMember)}
                                         footer={UserViewerCompFooter} selected={searchCards.filteringUserIds.includes(boardMember.userId)}/>;
                })}
                { remainingBoardMembers > 0 && <div style={{ opacity: ".55" }} className="card-member-card medium">+{remainingBoardMembers}</div> }
            </div>
        )

    }

    return (
        <section>
            { permissions.hasManageBoardUsersPermission() && (
                <>
                    <img src="/settings-icon.svg" alt="Settings" style={{ height: "36px", marginRight: "0.25rem" }}
                         ref={boardMembersButtonRef} onClick={() => setIsEditingMembers((prev: boolean) => !prev)}
                         className="icon clickable"/>
                    { isEditingMembers && (
                        <BoardUserSelector element={boardMembersButtonRef} close={() => setIsEditingMembers(false)}/>
                    )}
                </>
            )}
            { getMembersJsx() }
        </section>
    )

}

export default BoardCompHeaderMembersComp;