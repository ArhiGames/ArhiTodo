import { useEffect, useState } from "react";
import { useAuth } from "../../../../Contexts/useAuth.ts";
import type { UserWithClaims } from "../../../../Models/Administration/UserWithClaims.ts";
import EditableUserComp from "./EditableUserComp.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import UserDetailsModalComp from "./UserDetailsModalComp.tsx";
import InviteUserComp from "./InviteUserComp.tsx";
import ViewInvitationLinksComp from "./ViewInvitationLinksComp.tsx";

const AdminUserManagementComp = () => {

    const navigate = useNavigate();
    const { appUser, token } = useAuth();
    const { userId } = useParams();
    const [users, setUsers] = useState<UserWithClaims[]>([]);
    const [currentViewingUser, setCurrentViewingUser] = useState<UserWithClaims | null>(null);
    const [isViewingCreatedInvitationsLinks, setIsViewingCreatedInvitationsLinks] = useState<boolean>(false);

    useEffect(() => {

        if (!userId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentViewingUser(null);
            return;
        }

        const controller = new AbortController();
        fetch(`https://localhost:7069/api/account/admin/accountmanagement/users/${userId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
                signal: controller.signal
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                }

                return res.json();
            })
            .then((user: UserWithClaims)=> {
                setCurrentViewingUser(user)
            })
            .catch(console.error);

        return () => controller.abort();

    }, [token, userId]);

    useEffect(() => {

        if (userId) return;

        const controller = new AbortController();
        fetch('https://localhost:7069/api/account/admin/accountmanagement',
            {
                method: 'GET',
                headers: { "Authorization": `Bearer ${token}` },
                signal: controller.signal
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch accounts with claims")
                }

                return res.json();
            })
            .then((res: UserWithClaims[]) => {
                setUsers(res);
            })
            .catch(console.error);

        return () => controller.abort();

    }, [userId, token]);

    function onEditUser(user: UserWithClaims) {

        navigate(`/admin/dashboard/users/${user.userId}`);

    }

    return (
        <div className="admin-settings-content admin-usermanagement-page">
            <h2>User management</h2>
            <p>Manage user permissions, delete & add users</p>
            <div className="user-management-users-div">
                {users.map((user: UserWithClaims) => (
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
                    createPortal(<UserDetailsModalComp currentViewingUser={currentViewingUser}/>, document.body)
                )
            }

        </div>
    )

}

export default AdminUserManagementComp;