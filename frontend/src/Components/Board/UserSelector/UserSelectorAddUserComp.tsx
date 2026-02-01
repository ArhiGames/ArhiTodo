import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {AUTH_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import UserSelectorAddUserUserComp from "./UserSelectorAddUserUserComp.tsx";

interface Props {
    boardMembers: UserGetDto[];
    setBoardMembers: Dispatch<SetStateAction<UserGetDto[]>>
    updatedUsers: { userId: string, newMemberState: boolean }[];
    setUpdatedUsers: Dispatch<SetStateAction<{ userId: string, newMemberState: boolean }[]>>
}

const UserSelectorAddUserComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const [users, setUsers] = useState<UserGetDto[]>([]);

    useEffect(() => {

        const run = async () => {

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) return;

            fetch(`${AUTH_BASE_URL}/accounts/${0}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch all users");
                    }

                    return res.json();
                })
                .then((users: UserGetDto[]) => {
                    setUsers(users);
                })
                .catch(console.error);

        }
        run();


    }, [checkRefresh]);

    return (
        <div className="user-selector-add-user">
            {users.map((user: UserGetDto) => {
                return <UserSelectorAddUserUserComp key={user.userId} user={user} updatedUsers={props.updatedUsers} setUpdatedUsers={props.setUpdatedUsers}
                            isBoardMember={props.boardMembers.some((boardMember: UserGetDto) => boardMember.userId === user.userId)}/>
            })}
        </div>
    )

}

export default UserSelectorAddUserComp;