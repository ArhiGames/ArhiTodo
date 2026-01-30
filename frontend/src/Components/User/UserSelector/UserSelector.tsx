import Popover from "../../../lib/Popover/Popover.tsx";
import {type RefObject, useEffect, useState} from "react";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import {AUTH_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import UserSelectorUserCard from "./UserSelectorUserCard.tsx";
import "./UserSelector.css"

interface Props {
    element: RefObject<HTMLElement | null>;
    close: () => void;
}

const UserSelector = (props: Props) => {

    const { checkRefresh } = useAuth();
    const [users, setUsers] = useState<UserGetDto[]>([]);

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

    return (
        <Popover element={props.element} close={props.close}>
            <div className="user-selector-popover">
                {users.map((user: UserGetDto) => {
                    return <UserSelectorUserCard user={user}/>
                })}
                <div className="user-selector-footer">
                    <button onClick={props.close} className="button standard-button">Abort</button>
                </div>
            </div>
        </Popover>
    )

}

export default UserSelector;