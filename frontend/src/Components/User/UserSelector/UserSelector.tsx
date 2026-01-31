import Popover from "../../../lib/Popover/Popover.tsx";
import {type RefObject, useEffect, useState} from "react";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import {API_BASE_URL, AUTH_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import UserSelectorUserCard from "./UserSelectorUserCard.tsx";
import "./UserSelector.css"
import {defaultBoardClaims, type DefaultClaim} from "../../../lib/Claims.ts";
import UserSelectorToggleComp from "./UserSelectorToggleComp.tsx";
import {useParams} from "react-router-dom";
import type {Claim} from "../../../Models/Claim.ts";

interface Props {
    element: RefObject<HTMLElement | null>;
    close: () => void;
}

const UserSelector = (props: Props) => {

    const { checkRefresh } = useAuth();
    const { boardId } = useParams();

    const [users, setUsers] = useState<UserGetDto[]>([]);
    const [currentViewingUser, setCurrentViewingUser] = useState<UserGetDto | null>(null);
    const [updatedClaims, setUpdatedClaims] = useState<Claim[]>([]);

    useEffect(() => {

        const run = async () => {

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) return null;

            fetch(`${AUTH_BASE_URL}/accounts/0?boardPermissionsBoardId=${boardId}`, {
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
                    setUsers(user);
                })
                .catch(console.error);
        }

        run();

    }, [boardId, checkRefresh]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUpdatedClaims([]);
    }, [currentViewingUser]);

    function onAbortButtonPressed() {
        if (currentViewingUser) {
            setCurrentViewingUser(null);
            return;
        }
        props.close();
    }

    async function onSaveChangesButtonPressed() {
        if (!currentViewingUser) return;

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

                const newUsers = [...users];
                const foundUser: UserGetDto | undefined = newUsers.find((user: UserGetDto) => user.userId === currentViewingUser.userId)
                if (!foundUser) return;
                foundUser.boardUserClaims = boardUserClaims;

                setUsers(newUsers);
                setCurrentViewingUser(null);
            })
            .catch(console.error)
            .finally(() => {
                setUpdatedClaims([]);
            })
    }

    return (
        <Popover element={props.element} close={props.close}>
            <div className="user-selector-popover">
                {
                    currentViewingUser ? (
                        <>
                            <div className="user-selector-user-information">
                                <p style={{ fontWeight: "bold" }}>{currentViewingUser.userName}</p>
                                <p style={{ opacity: "75%" }}>{currentViewingUser.email}</p>
                            </div>
                            <div className="user-selector-claims">
                                {defaultBoardClaims.map((defaultClaim: DefaultClaim) => {
                                    return <UserSelectorToggleComp updatedClaims={updatedClaims} setUpdatedClaims={setUpdatedClaims}
                                            defaultClaim={defaultClaim}
                                            claim={currentViewingUser.boardUserClaims.find(buc => buc.claimType === defaultClaim.claimType)}/>;
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="user-selector-users">
                            {users.map((user: UserGetDto) => {
                                return <UserSelectorUserCard onSelected={setCurrentViewingUser} user={user}/>
                            })}
                        </div>
                    )
                }

                <div className="user-selector-footer">
                    { currentViewingUser && <button className={`button ${updatedClaims.length > 0 ? 
                        "valid-submit-button" : "standard-button"}`} onClick={onSaveChangesButtonPressed}>Save</button> }
                    <button onClick={onAbortButtonPressed} className="button standard-button">Abort</button>
                </div>
            </div>
        </Popover>
    )

}

export default UserSelector;