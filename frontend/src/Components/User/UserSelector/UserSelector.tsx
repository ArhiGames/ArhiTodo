import Popover from "../../../lib/Popover/Popover.tsx";
import {type RefObject, useEffect, useState} from "react";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import {AUTH_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import UserSelectorUserCard from "./UserSelectorUserCard.tsx";
import "./UserSelector.css"
import {defaultBoardClaims, type DefaultClaim} from "../../../lib/Claims.ts";
import UserSelectorToggleComp from "./UserSelectorToggleComp.tsx";

interface Props {
    element: RefObject<HTMLElement | null>;
    close: () => void;
}

const UserSelector = (props: Props) => {

    const { checkRefresh } = useAuth();

    const [users, setUsers] = useState<UserGetDto[]>([]);
    const [currentViewingUser, setCurrentViewingUser] = useState<UserGetDto | null>(null);

    useEffect(() => {

        const run = async () => {

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) return null;

            fetch(`${AUTH_BASE_URL}/accounts/0`, {
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

    }, [checkRefresh]);

    function onAbortButtonPressed() {
        if (currentViewingUser) {
            setCurrentViewingUser(null);
            return;
        }
        props.close();
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
                                    return <UserSelectorToggleComp defaultClaim={defaultClaim}/>;
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
                    { currentViewingUser && <button className="button standard-button">Save</button> }
                    <button onClick={onAbortButtonPressed} className="button standard-button">Abort</button>
                </div>
            </div>
        </Popover>
    )

}

export default UserSelector;