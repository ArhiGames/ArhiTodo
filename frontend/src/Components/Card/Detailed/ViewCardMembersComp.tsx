import {useCallback, useRef, useState} from "react";
import DefaultUserSelectorUserComp from "../../User/UserSelector/DefaultUserSelectorUserComp.tsx";
import Popover from "../../../lib/Popover/Popover.tsx";
import "./DetailedCard.css"
import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {useParams} from "react-router-dom";
import type {Board, PublicUserGetDto, Card} from "../../../Models/States/KanbanState.ts";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import CardUserIcon from "../CardUserIcon.tsx";
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";

const ViewCardMembersComp = () => {

    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const permissions = usePermissions();
    const { boardId, cardId } = useParams();
    const { checkRefresh, appUser } = useAuth();

    const [isEditingMembers, setIsEditingMembers] = useState<boolean>(false);
    const [selectedUsers, setSelectedUsers] = useState<PublicUserGetDto[]>(getCurrentSelectedStateUsers());

    const boardMembers: PublicUserGetDto[]= kanbanState.boards.get(Number(boardId))?.boardMembers ?? [];
    const addCardMemberRef = useRef<HTMLDivElement>(null);

    function onOpenCardMembersClicked(e: React.MouseEvent<HTMLDivElement>) {
        if (!permissions.hasManageCardsPermission()) return;
        addCardMemberRef.current = e.currentTarget;
        setIsEditingMembers(true);
    }

    function getCurrentSelectedStateUsers() {
        const card: Card | undefined = kanbanState.cards.get(Number(cardId));
        const board: Board | undefined = kanbanState.boards.get(Number(boardId));

        if (!card || !board) return [];

        return card.assignedUserIds
            .map(assignedUserId => board.boardMembers.find(bm => bm.userId === assignedUserId))
            .filter((bm): bm is PublicUserGetDto => !!bm);
    }

    const postAssignCardMember = useCallback(async (userId: string) => {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "REMOVE_ASSIGNED_CARD_MEMBER", payload: { cardId: Number(cardId), assignedUserId: userId } });
            }
        }

        fetch(`${API_BASE_URL}/card/${Number(cardId)}/assign/user/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not assign user to card!");
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "REMOVE_ASSIGNED_CARD_MEMBER", payload: { cardId: Number(cardId), assignedUserId: userId } });
                }
                console.error(err);
            });
    }, [cardId, checkRefresh, dispatch])

    async function deleteAssignCardMember(userId: string) {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "ASSIGN_CARD_MEMBER", payload: { cardId: Number(cardId), assignedUserId: userId } });
            }
        }

        fetch(`${API_BASE_URL}/card/${Number(cardId)}/unassign/user/${userId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
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

    function getSortedAssignedUsersJsx() {
        const card: Card | undefined = kanbanState.cards.get(Number(cardId));
        if (!card) return null;

        const sortedUserIds: string[] = [...card.assignedUserIds].sort((a: string, b: string) => {
            if (a === appUser?.id) return -1;
            if (b === appUser?.id) return 1;
            return 0;
        });

        return (
            <>
                { sortedUserIds.map((userId: string) => {
                    return <CardUserIcon onClick={onOpenCardMembersClicked} key={userId} cardMemberId={userId}/>
                })}
            </>
        )
    }

    return (
        <>
            <div className="card-detail-members">
                { getSortedAssignedUsersJsx() }
                { permissions.hasManageCardsPermission() && <div onClick={onOpenCardMembersClicked} className="card-member-card" ref={addCardMemberRef}>+</div> }
            </div>
            { isEditingMembers && (
                <Popover close={() => setIsEditingMembers(false)} element={addCardMemberRef} closeIfClickedOutside>
                    <div className="view-card-members-popover">
                        <h3>Assign users</h3>
                        <div className="card-members-selector">
                            {boardMembers.map((user: PublicUserGetDto) => (
                                <DefaultUserSelectorUserComp key={user.userId} user={user} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}
                                                             onUserSelected={onUserSelected} onUserUnselected={onUserUnselected} />
                            ))}
                        </div>
                    </div>
                </Popover>
            )}
        </>
    )

}

export default ViewCardMembersComp;