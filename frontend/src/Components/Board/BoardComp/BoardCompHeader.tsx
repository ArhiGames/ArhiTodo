import type {Board, Project, PublicUserGetDto} from "../../../Models/States/KanbanState.ts";
import {useRef, useState} from "react";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import BoardUserSelector from "../UserSelector/BoardUserSelector.tsx";
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import {useParams} from "react-router-dom";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import CardUserIcon from "../../User/CardUserIcon.tsx";
import {useCardsSearch} from "../../../Contexts/Kanban/Cards/SearchCardsContexts.ts";
import BoardCompHeaderFilteringLabelsComp from "./BoardCompHeaderFilteringLabelsComp.tsx";
import UrgencyFilterComp from "./UrgencyFilterComp.tsx";

const BoardCompHeader = () => {

    const kanbanState = useKanbanState();
    const permissions = usePermissions();
    const { appUser } = useAuth();
    const { projectId, boardId } = useParams();
    const searchCards = useCardsSearch();

    const boardMembersButtonRef = useRef<HTMLImageElement>(null);
    const [isEditingMembers, setIsEditingMembers] = useState<boolean>(false);

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
                    return <CardUserIcon key={boardMember.userId} canViewDetails size="medium" user={boardMember}/>;
                })}
                { remainingBoardMembers > 0 && <div style={{ opacity: ".55" }} className="card-member-card medium">+{remainingBoardMembers}</div> }
            </div>
        )

    }

    return (
        <div className="current-board-header">
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
            <BoardCompHeaderFilteringLabelsComp/>
            <UrgencyFilterComp/>

            <section>
                <div className="cards-search-bar">
                    <input type="text" className="classic-input small" placeholder="Search cards..."
                           value={searchCards.searchString} onChange={(e) => searchCards.setSearchString(e.target.value)}/>
                    <img src="/search-icon.svg" alt="" className="icon" height="24px"/>
                </div>
            </section>
        </div>
    )

}

export default BoardCompHeader;