import {useEffect, useState} from "react";
import { useAuth } from "../../../../../Contexts/Authentication/useAuth.ts";
import EditableUserComp from "./EditableUserComp.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import UserDetailsModalComp from "./UserDetailsModalComp.tsx";
import InviteUserComp from "../Invitation/InviteUserComp.tsx";
import ViewInvitationLinksComp from "../Invitation/ViewInvitationLinksComp.tsx";
import {AUTH_BASE_URL} from "../../../../../config/api.ts";
import type {UserGetDto} from "../../../../../Models/BackendDtos/Auth/UserGetDto.ts";

const AdminUserManagementComp = () => {

    const navigate = useNavigate();
    const { appUser, token, checkRefresh } = useAuth();
    const { userId } = useParams();
    const [users, setUsers] = useState<UserGetDto[]>([]);
    const [usersCount, setUsersCount] = useState<number>(0);
    const [currentViewingUser, setCurrentViewingUser] = useState<UserGetDto | null>(null);
    const [isViewingCreatedInvitationsLinks, setIsViewingCreatedInvitationsLinks] = useState<boolean>(false);

    const loadUsers = async (page: number) => {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${AUTH_BASE_URL}/accounts/${page}`,
            {
                method: 'GET',
                headers: {"Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}`}
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch accounts with claims")
                }

                return res.json();
            })
            .then((accounts: UserGetDto[]) => {
                const newUsers = [...users];
                for (const foundUser of accounts) {
                    if (!newUsers.some((user: UserGetDto) => user.userId === foundUser.userId)) {
                        newUsers.push(foundUser);
                    }
                }
                setUsers(newUsers);
            })
            .catch(err => {
                console.error(err);
            });
    }

    async function onLoadMoreButtonPressed() {
        const nextPage = (Math.floor(users.length / 5) - 1) + Math.floor(usersCount / 5);
        await loadUsers(nextPage);
    }

    useEffect(() => {

        if (!userId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentViewingUser(null);
            return;
        }

        const controller = new AbortController();

        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || controller.signal.aborted) return;

            fetch(`${AUTH_BASE_URL}/accounts/user/${userId}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
                    signal: controller.signal
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(res.statusText);
                    }

                    return res.json();
                })
                .then((user: UserGetDto) => {
                    setCurrentViewingUser(user)
                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        return;
                    }
                    console.error(err);
                });
        }

        run();

        return () => controller.abort();

    }, [checkRefresh, token, userId]);

    useEffect(() => {

        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) return;

            await fetch(`${AUTH_BASE_URL}/accounts/count`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Could not retrieve account num!");
                    }

                    return res.json();
                })
                .then((userCount: { userCount: number }) => {
                    setUsersCount(userCount.userCount);
                })
                .catch(console.error);

            await loadUsers(0);
        }

        run();

    }, [checkRefresh]);

    function onEditUser(user: UserGetDto) {
        navigate(`/admin/dashboard/users/${user.userId}`);
    }

    return (
        <div className="admin-settings-content admin-usermanagement-page">
            <h2>User management</h2>
            <p>Manage user permissions, delete & add users</p>
            <div className="user-management-users-div scroller">
                {users.map((user: UserGetDto) => (
                    <EditableUserComp canEdit={user.userName !== "admin"} isSelf={user.userId === appUser?.id} onEdit={onEditUser} user={user} key={user.userId}/>
                ))}
                { usersCount > users.length && <button onClick={onLoadMoreButtonPressed} className="users-show-more">Show more...</button> }
            </div>
            <nav className="user-management-nav">
                <InviteUserComp onInvitationViewClicked={() => setIsViewingCreatedInvitationsLinks(true)}/>
            </nav>
            {
                (!currentViewingUser && isViewingCreatedInvitationsLinks) && (
                    <ViewInvitationLinksComp onClosed={() => setIsViewingCreatedInvitationsLinks(false)}/>
                )
            }
            {
                currentViewingUser && (
                    createPortal(<UserDetailsModalComp setCurrentViewingUser={setCurrentViewingUser} currentViewingUser={currentViewingUser}/>, document.body)
                )
            }

        </div>
    )

}

export default AdminUserManagementComp;