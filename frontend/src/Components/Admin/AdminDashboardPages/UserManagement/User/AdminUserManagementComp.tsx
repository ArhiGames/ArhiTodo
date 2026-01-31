import { useEffect, useState } from "react";
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
    const [currentViewingUser, setCurrentViewingUser] = useState<UserGetDto | null>(null);
    const [isViewingCreatedInvitationsLinks, setIsViewingCreatedInvitationsLinks] = useState<boolean>(false);

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

        if (userId) return;

        const controller = new AbortController();

        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || controller.signal.aborted) return;

            fetch(`${AUTH_BASE_URL}/accounts/0`,
                {
                    method: 'GET',
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
                    signal: controller.signal
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch accounts with claims")
                    }

                    return res.json();
                })
                .then((res: UserGetDto[]) => {
                    setUsers(res);
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

    }, [userId, token, checkRefresh]);

    function onEditUser(user: UserGetDto) {
        navigate(`/admin/dashboard/users/${user.userId}`);
    }

    return (
        <div className="admin-settings-content admin-usermanagement-page">
            <h2>User management</h2>
            <p>Manage user permissions, delete & add users</p>
            <div className="user-management-users-div">
                {users.map((user: UserGetDto) => (
                    <EditableUserComp canEdit={user.userName !== "admin"} isSelf={user.userId === appUser?.id} onEdit={onEditUser} user={user} key={user.userId}/>
                ))}
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