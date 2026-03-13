import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import BoardUserSelector from "../UserSelector/BoardUserSelector.tsx";
import {useRef, useState} from "react";
import type {Board, Project, PublicUserGetDto} from "../../../Models/States/KanbanState.ts";
import CardUserIcon from "../../User/CardUserIcon.tsx";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {useParams} from "react-router-dom";
import {useCardsSearch} from "../../../Contexts/Kanban/Cards/SearchCardsContexts.ts";
import Popover from "../../../lib/Popover/Popover.tsx";
import GeneralUserViewerComp from "../../User/GeneralUserViewerComp.tsx";

const UserViewerCompFooter = ({ user, close }: { user: PublicUserGetDto, close: () => void }) => {

    const cardSearch = useCardsSearch();

    function isFiltered(): boolean {
        return cardSearch.filteringUserIds.includes(user.userId);
    }

    function onViewUserClick() {
        if (isFiltered()) {
            cardSearch.setFilteringUserIds((prev: string[]) => prev.filter((userId: string) => userId !== user.userId));
        } else {
            cardSearch.setFilteringUserIds((prev: string[]) => [...prev, user.userId]);
            close();
        }
    }

    return (
        <div className="user-viewer-filter-footer-div">
            <button className="button standard-button" onClick={onViewUserClick}>{isFiltered() ? "Remove filter" : "Show cards with user"}</button>
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
    const viewRemainingUsersDiv = useRef<HTMLDivElement>(null);
    const [isViewingRemainingMembers, setIsViewingRemainingMembers] = useState<boolean>(false);
    const [isEditingMembers, setIsEditingMembers] = useState<boolean>(false);

    function onUserIconPressed(user: PublicUserGetDto) {
        searchCards.setFilteringUserIds((prev: string[]) => prev.filter((userId: string) => user.userId !== userId));
    }

    function canViewDetails(user: PublicUserGetDto): boolean {
        return !searchCards.filteringUserIds.includes(user.userId);
    }

    function getMembers(): PublicUserGetDto[] {
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
        return members;
    }

    function getMembersJsx() {
        const originalUsers: PublicUserGetDto[] = getMembers();
        const members: PublicUserGetDto[] = originalUsers.filter((boardMember: PublicUserGetDto, index: number) => {
            return index < 5 || searchCards.filteringUserIds.includes(boardMember.userId);
        });
        const remainingBoardMembers: number = originalUsers.length - members.length;
        return (
            <div className="board-members">
                {members.map((boardMember: PublicUserGetDto) => {
                    return (
                        <CardUserIcon key={boardMember.userId} canViewDetails={canViewDetails} size="medium" user={boardMember}
                                      onClick={() => onUserIconPressed(boardMember)}
                                      footer={UserViewerCompFooter} selected={searchCards.filteringUserIds.includes(boardMember.userId)}/>
                    );
                })}
                { remainingBoardMembers > 0 && <div style={{ opacity: ".55" }} onClick={() => setIsViewingRemainingMembers(prev => !prev)}
                                                    className="card-member-card medium" ref={viewRemainingUsersDiv}>+{remainingBoardMembers}</div> }
            </div>
        )
    }

    return (
        <>
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
            { isViewingRemainingMembers && (
                <Popover close={() => setIsViewingRemainingMembers(false)} element={viewRemainingUsersDiv} triggerElement={viewRemainingUsersDiv}>
                    <div className="remaining-members-filter-popover-div scroller">
                        {getMembers().slice(5).map((member: PublicUserGetDto) => {
                            if (searchCards.filteringUserIds.includes(member.userId)) return null;
                            return (
                                <div className="remaining-member-filter-comp">
                                    <GeneralUserViewerComp user={member} options={{ showProjectOwner: true, showBoardOwner: true }} key={member.userId}
                                                           close={() => setIsViewingRemainingMembers(false)} footer={UserViewerCompFooter}/>
                                </div>
                            )
                        })}
                    </div>
                </Popover>
            )}
        </>
    )

}

export default BoardCompHeaderMembersComp;