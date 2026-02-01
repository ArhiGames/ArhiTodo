import Popover from "../../../lib/Popover/Popover.tsx";
import {type RefObject, useEffect, useState} from "react";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import UserSelectorUserCard from "./UserSelectorUserCard.tsx";
import "./UserSelector.css"
import {useParams} from "react-router-dom";
import type {Claim} from "../../../Models/Claim.ts";
import UserSelectorEditUserClaimsComp from "./UserSelectorEditUserClaimsComp.tsx";
import UserSelectorAddUserComp from "./UserSelectorAddUserComp.tsx";

interface Props {
    element: RefObject<HTMLElement | null>;
    close: () => void;
}

const UserSelector = (props: Props) => {

    const { checkRefresh } = useAuth();
    const { boardId } = useParams();

    const [boardMembers, setBoardMembers] = useState<UserGetDto[]>([]);
    const [currentViewingUser, setCurrentViewingUser] = useState<UserGetDto | null>(null);
    const [updatedClaims, setUpdatedClaims] = useState<Claim[]>([]);

    const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
    const [updatedUsers, setUpdatedUsers] = useState<{ userId: string, newMemberState: boolean }[]>([]);

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
                .then((user: UserGetDto[]) => {
                    setBoardMembers(user);
                })
                .catch(console.error);
        }

        run();

    }, [boardId, checkRefresh]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUpdatedClaims([]);
        setUpdatedUsers([]);
    }, [currentViewingUser, isAddingUser]);

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

                const newUsers = [...boardMembers];
                const foundUser: UserGetDto | undefined = newUsers.find((user: UserGetDto) => user.userId === currentViewingUser.userId)
                if (!foundUser) return;
                foundUser.boardUserClaims = boardUserClaims;

                setBoardMembers(newUsers);
                setCurrentViewingUser(null);
            })
            .catch(console.error)
            .finally(() => {
                setUpdatedClaims([]);
            })
    }

    async function onSaveMembersChangesButtonPressed() {
        if (!isAddingUser) return;
        if (updatedUsers.length <= 0) return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/board/${boardId}/members`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify(updatedUsers),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not update the board members states");
                }

                return res.json();
            })
            .then((user: UserGetDto[]) => {
                setBoardMembers(user);
                setIsAddingUser(false);
            })
            .catch(console.error)
            .finally(() => {
                setUpdatedUsers([]);
            })
    }

    return (
        <Popover element={props.element} close={props.close}>
            <div className="user-selector-popover">
                {
                    isAddingUser ? (
                        <>
                            <h3>Manage users</h3>
                            <UserSelectorAddUserComp setBoardMembers={setBoardMembers} boardMembers={boardMembers}
                                                     updatedUsers={updatedUsers} setUpdatedUsers={setUpdatedUsers}/>
                        </>
                    ) : currentViewingUser ? (
                        <UserSelectorEditUserClaimsComp updatedClaims={updatedClaims} setUpdatedClaims={setUpdatedClaims} currentViewingUser={currentViewingUser}/>
                    ) : (
                        <div className="user-selector-users">
                            <h3>Members</h3>
                            {boardMembers.map((user: UserGetDto) => {
                                return <UserSelectorUserCard onSelected={setCurrentViewingUser} user={user}/>
                            })}
                        </div>
                    )
                }

                <div className="user-selector-footer">
                    { !currentViewingUser && !isAddingUser && <button onClick={() => setIsAddingUser(true)}
                                                                      className="button standard-button">Manage users</button> }
                    { isAddingUser ? (
                        <button className={`button ${updatedUsers.length > 0 ? 
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

export default UserSelector;