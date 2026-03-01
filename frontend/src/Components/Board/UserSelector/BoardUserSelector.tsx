import Popover from "../../../lib/Popover/Popover.tsx";
import {type RefObject, useEffect, useState} from "react";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import BoardUserSelectorUserCard from "./BoardUserSelectorUserCard.tsx";
import "./BoardUserSelector.css"
import {useParams} from "react-router-dom";
import type {Claim} from "../../../Models/Claim.ts";
import BoardUserSelectorEditUserClaimsComp from "./BoardUserSelectorEditUserClaimsComp.tsx";
import AccountUserSelector from "../../User/UserSelector/AccountUserSelector.tsx";
import BoardUserSelectorAddUserComp from "./BoardUserSelectorAddUserComp.tsx";
import {useRealtimeHub} from "../../../Contexts/Realtime/Hooks.ts";

interface Props {
    element: RefObject<HTMLElement | null>;
    close: () => void;
}

const BoardUserSelector = (props: Props) => {

    const { checkRefresh } = useAuth();
    const { boardId } = useParams();
    const hubConnection = useRealtimeHub();

    const [boardMembers, setBoardMembers] = useState<UserGetDto[]>([]);
    const [currentViewingUser, setCurrentViewingUser] = useState<UserGetDto | null>(null);
    const [updatedClaims, setUpdatedClaims] = useState<Claim[]>([]);

    const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
    const [selectedAddingUsers, setSelectedAddingUsers] = useState<UserGetDto[]>([]);
    const [updatedMemberStates, setUpdatedMemberStates] = useState<Map<string, boolean>>(new Map()); // userId <-> memberState

    useEffect(() => {

        const run = async () => {

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) return null;

            fetch(`${API_BASE_URL}/board/${boardId}/members`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Error fetching user data.");
                    }

                    return res.json();
                })
                .then((users: UserGetDto[]) => {
                    setBoardMembers(users);
                    setSelectedAddingUsers(users)
                })
                .catch(console.error);
        }

        run();

    }, [boardId, checkRefresh]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUpdatedClaims([]);
        setUpdatedMemberStates(new Map());
    }, [currentViewingUser, isAddingUser]);

    function onUserMemberSelected(user: UserGetDto) {
        setUpdatedMemberStates((prev: Map<string, boolean>) => {
            prev.set(user.userId, true);
            return prev;
        });
    }

    function onUserMemberUnselected(user: UserGetDto) {
        setUpdatedMemberStates((prev: Map<string, boolean>) => {
            prev.set(user.userId, false);
            return prev;
        });
    }

    function onAbortButtonPressed() {
        if (isAddingUser) {
            setIsAddingUser(false);
            return;
        }
        if (currentViewingUser) {
            setCurrentViewingUser(null);
            return;
        }
        props.close();
    }

    async function onSaveClaimChangesButtonPressed() {
        if (!currentViewingUser) return;
        if (updatedClaims.length <= 0) return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return null;

        fetch(`${API_BASE_URL}/board/${boardId}/permissions/${currentViewingUser.userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify(updatedClaims),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed updating board permissions of user ${currentViewingUser.userId}`);
                }

                return res.json();
            })
            .then((boardUserClaims: Claim[]) => {
                setBoardMembers((prev: UserGetDto[]) => {
                    const foundUser: UserGetDto | undefined = prev.find((user: UserGetDto) => user.userId === currentViewingUser.userId)
                    if (!foundUser) return prev;
                    foundUser.boardUserClaims = boardUserClaims;
                    return prev;
                });
                setCurrentViewingUser(null);
            })
            .catch(console.error)
            .finally(() => {
                setUpdatedClaims([]);
            })
    }

    async function onSaveMembersChangesButtonPressed() {
        if (!isAddingUser) return;
        if (updatedMemberStates.size <= 0) return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        const boardMemberStatusUpdateList: { userId: string, newMemberState: boolean }[] = [];
        updatedMemberStates.forEach((value: boolean, key: string) => {
            boardMemberStatusUpdateList.push({ userId: key, newMemberState: value });
        })

        fetch(`${API_BASE_URL}/board/${boardId}/members`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
            body: JSON.stringify(boardMemberStatusUpdateList),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not update the board members states");
                }

                return res.json();
            })
            .then((members: UserGetDto[]) => {
                setBoardMembers(members);
            })
            .catch(console.error)
            .finally(() => {
                setIsAddingUser(false);
                setUpdatedMemberStates(new Map());
            })
    }

    return (
        <Popover element={props.element} triggerElement={props.element} close={props.close}>
            <div className="board-user-selector-popover">
                {
                    isAddingUser ? (
                        <>
                            <h3>Manage users</h3>
                            <AccountUserSelector selectedUsers={selectedAddingUsers} setSelectedUsers={setSelectedAddingUsers} child={BoardUserSelectorAddUserComp}
                                                 onUserSelected={onUserMemberSelected} onUserUnselected={onUserMemberUnselected}/>
                        </>
                    ) : currentViewingUser ? (
                        <BoardUserSelectorEditUserClaimsComp updatedClaims={updatedClaims} setUpdatedClaims={setUpdatedClaims} currentViewingUser={currentViewingUser}/>
                    ) : (
                        <div className="user-selector-users scroller">
                            <h3>Members</h3>
                            {boardMembers.map((user: UserGetDto) => {
                                return <BoardUserSelectorUserCard key={user.userId} onSelected={setCurrentViewingUser} user={user}/>
                            })}
                        </div>
                    )
                }

                <div className="board-user-selector-footer">
                    { !currentViewingUser && !isAddingUser && <button onClick={() => setIsAddingUser(true)}
                                                                      className="button standard-button">Manage users</button> }
                    { isAddingUser ? (
                        <button className={`button ${updatedMemberStates.size > 0 ? 
                            "valid-submit-button" : "standard-button"}`} onClick={onSaveMembersChangesButtonPressed}>Save</button>
                    ) : currentViewingUser ? (
                        <button className={`button ${updatedClaims.length > 0 ?
                            "valid-submit-button" : "standard-button"}`} onClick={onSaveClaimChangesButtonPressed}>Save</button>
                    ) : null }
                    <button onClick={onAbortButtonPressed} className="button standard-button">Abort</button>
                </div>
            </div>
        </Popover>
    )

}

export default BoardUserSelector;