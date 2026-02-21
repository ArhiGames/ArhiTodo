import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {AUTH_BASE_URL} from "../../../config/api.ts";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import "./UserSelector.css"

interface Props {
    child: React.FunctionComponent<{
        user: UserGetDto,
        selectedUsers: UserGetDto[],
        setSelectedUsers: Dispatch<SetStateAction<UserGetDto[]>>,
        onUserSelected?: (user: UserGetDto) => void,
        onUserUnselected?: (user: UserGetDto) => void
    }>;
    selectedUsers: UserGetDto[];
    setSelectedUsers: Dispatch<SetStateAction<UserGetDto[]>>;
    onUserSelected?: (user: UserGetDto) => void;
    onUserUnselected?: (user: UserGetDto) => void;
}

const AccountUserSelector = (props: Props) => {

    const { checkRefresh } = useAuth();

    const [totalUserAccountsCount, setTotalUserAccountsCount] = useState<number>(0);
    const [userAccounts, setUserAccounts] = useState<UserGetDto[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const pages: number = Math.floor((totalUserAccountsCount / 5) + 1);

    useEffect(() => {

        const run = async () => {

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) return;

            await fetch(`${AUTH_BASE_URL}/accounts/count`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Could not fetch accounts");
                    }

                    return res.json();
                })
                .then((result: { userCount: number }) => {
                    setTotalUserAccountsCount(result.userCount);
                })
                .catch(console.error);

        }
        run();

    }, [checkRefresh]);

    useEffect(() => {

        const maxAccountsThisPage = (currentPage + 1) * 5;
        if (maxAccountsThisPage - 5 > totalUserAccountsCount) return;
        if (userAccounts.length >= maxAccountsThisPage) return;

        const run = async () => {

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) return;

            fetch(`${AUTH_BASE_URL}/accounts/${currentPage}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Could not fetch accounts");
                    }

                    return res.json();
                })
                .then((accounts: UserGetDto[]) => {
                    setUserAccounts((prev: UserGetDto[]) => {
                        const newUserAccounts = [...prev];
                        for (const account of accounts) {
                            if (!newUserAccounts.some(a => a.userId === account.userId)) {
                                newUserAccounts.push(account);
                            }
                        }
                        return newUserAccounts;
                    });
                })
                .catch(console.error);

        }
        run();

    }, [totalUserAccountsCount, currentPage, checkRefresh]);

    return (
        <div className="user-selector">
            <div className="user-selector-users">
                {userAccounts.slice(currentPage * 5, (currentPage * 5) + 5).map((user: UserGetDto) => {
                    return <props.child key={user.userId} user={user} selectedUsers={props.selectedUsers} setSelectedUsers={props.setSelectedUsers}
                                        onUserSelected={props.onUserSelected} onUserUnselected={props.onUserUnselected}/>
                })}
            </div>
            {
                pages > 0 && (
                    <div className="user-selector-pages">
                        <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)} className="button standard-button">Prev</button>
                        <p>{currentPage + 1}</p>
                        <button disabled={currentPage + 1 >= pages} onClick={() => setCurrentPage(currentPage + 1)} className="button standard-button">Next</button>
                    </div>
                )
            }
        </div>
    )

}

export default AccountUserSelector;