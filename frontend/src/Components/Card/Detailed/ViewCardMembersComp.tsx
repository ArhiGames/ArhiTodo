import {useRef, useState} from "react";
import DefaultUserSelectorUserComp from "../../User/UserSelector/DefaultUserSelectorUserComp.tsx";
import Popover from "../../../lib/Popover/Popover.tsx";
import "./DetailedCard.css"
import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {useParams} from "react-router-dom";
import type {Board, PublicUserGetDto, Card, Project} from "../../../Models/States/KanbanState.ts";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import {useRealtimeHub} from "../../../Contexts/Realtime/Hooks.ts";
import CardMembersListComp from "../CardMembersListComp.tsx";

const ViewCardMembersComp = () => {

    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const permissions = usePermissions();
    const { projectId, boardId, cardId } = useParams();
    const { checkRefresh } = useAuth();
    const hubConnection = useRealtimeHub();

    const [isEditingMembers, setIsEditingMembers] = useState<boolean>(false);
    const [selectedUsers, setSelectedUsers] = useState<PublicUserGetDto[]>(getCurrentSelectedStateUsers());

    const addCardMemberRef = useRef<HTMLDivElement>(null);

    function onOpenCardMembersClicked(e: React.MouseEvent<HTMLDivElement>) {
        if (!permissions.hasManageCardsPermission()) return;
        addCardMemberRef.current = e.currentTarget;
        setIsEditingMembers((prev: boolean) => !prev);
    }

    function getCurrentSelectedStateUsers(): PublicUserGetDto[] {
        const project: Project | undefined = kanbanState.projects.get(Number(projectId));
        const board: Board | undefined = kanbanState.boards.get(Number(boardId));
        const card: Card | undefined = kanbanState.cards.get(Number(cardId));
        if (!project || !board || !card) return [];

        const publicUserGetDtos: PublicUserGetDto[] = [];
        for (const assignedUserId of card.assignedUserIds) {
            const foundProjectManager: PublicUserGetDto | undefined = project.projectManagers.find((pm: PublicUserGetDto) => pm.userId === assignedUserId);
            if (foundProjectManager) {
                publicUserGetDtos.push(foundProjectManager)
            } else {
                const foundBoardMember: PublicUserGetDto | undefined = board.boardMembers.find((bm: PublicUserGetDto) => bm.userId === assignedUserId);
                if (foundBoardMember) {
                    publicUserGetDtos.push(foundBoardMember)
                }
            }
        }
        return publicUserGetDtos;
    }

    async function postAssignCardMember(userId: string) {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({
                    type: "REMOVE_ASSIGNED_CARD_MEMBER",
                    payload: {cardId: Number(cardId), assignedUserId: userId}
                });
            }
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/assign/user/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not assign user to card!");
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({
                        type: "REMOVE_ASSIGNED_CARD_MEMBER",
                        payload: {cardId: Number(cardId), assignedUserId: userId}
                    });
                }
                console.error(err);
            });
    }

    async function deleteAssignCardMember(userId: string) {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "ASSIGN_CARD_MEMBER", payload: { cardId: Number(cardId), assignedUserId: userId } });
            }
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/unassign/user/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not remove assigned user from card!");
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "ASSIGN_CARD_MEMBER", payload: { cardId: Number(cardId), assignedUserId: userId } });
                }
                console.error(err);
            })
    }

    async function onUserSelected(user: PublicUserGetDto) {
        const card: Card | undefined = kanbanState.cards.get(Number(cardId));
        if (!card) return;

        if (!card.assignedUserIds.some(asu => user.userId == asu)) {
            if (dispatch) {
                dispatch({ type: "ASSIGN_CARD_MEMBER", payload: { cardId: Number(cardId), assignedUserId: user.userId } });
            }
            await postAssignCardMember(user.userId);
        }
    }

    async function onUserUnselected(user: PublicUserGetDto) {
        const card: Card | undefined = kanbanState.cards.get(Number(cardId));
        if (!card) return;

        if (card.assignedUserIds.some(asu => user.userId == asu)) {
            if (dispatch) {
                dispatch({ type: "REMOVE_ASSIGNED_CARD_MEMBER", payload: { cardId: Number(cardId), assignedUserId: user.userId } });
            }
            await deleteAssignCardMember(user.userId);
        }
    }

    function getAddableCardMembers(): PublicUserGetDto[] {
        const members: PublicUserGetDto[] = [];
        for (const boardMember of kanbanState.boards.get(Number(boardId))?.boardMembers ?? []) {
            members.push(boardMember);
        }

        for (const projectManager of kanbanState.projects.get(Number(projectId))?.projectManagers ?? []) {
            if (!members.some((member: PublicUserGetDto) => member.userId === projectManager.userId)) {
                members.push(projectManager);
            }
        }

        return members;
    }

    return (
        <>
            <div className="card-detail-members">
                <CardMembersListComp cardId={Number(cardId)} onClicked={onOpenCardMembersClicked} maxUserIconsToShow={10}/>
                { permissions.hasManageCardsPermission() && <div onClick={onOpenCardMembersClicked} className="card-member-card small" ref={addCardMemberRef}>+</div> }
            </div>
            { isEditingMembers && (
                <Popover close={() => setIsEditingMembers(false)} element={addCardMemberRef} triggerElement={addCardMemberRef}>
                    <div className="view-card-members-popover">
                        <h3>Assign users</h3>
                        <div className="card-members-selector scroller">
                            {getAddableCardMembers().map((user: PublicUserGetDto) => (
                                <DefaultUserSelectorUserComp key={user.userId} user={user} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}
                                                             onUserSelected={onUserSelected} onUserUnselected={onUserUnselected}
                                                             userSelectorOptions={{ showProjectOwner: true, showBoardOwner: true }} selfEditable/>
                            ))}
                        </div>
                    </div>
                </Popover>
            )}
        </>
    )

}

export default ViewCardMembersComp;