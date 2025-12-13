import {useEffect, useState} from "react";
import {useAuth} from "../../../../Contexts/useAuth.ts";
import type {UserWithClaims} from "../../../../Models/Administration/UserWithClaims.ts";
import EditableUserComp from "../EditableUserComp.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {createPortal} from "react-dom";
import Modal from "../../../../lib/Modal/Modal.tsx";

const AdminUserManagementComp = () => {

    const { token } = useAuth();
    const { userId } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserWithClaims[]>([]);
    const [currentViewingUser, setCurrentViewingUser] = useState<UserWithClaims | null>(null);

    useEffect(() => {

        if (!userId) {
            setTimeout(() => setCurrentViewingUser(null), 0);
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

    }, [token]);

    function onEditUser(user: UserWithClaims) {

        navigate(`/admin/dashboard/users/${user.userId}`);

    }

    return (
        <div className="admin-settings-content admin-usermanagement-page">
            <h2>User management</h2>
            <p>Manage user permissions, delete & add users</p>
            {users.map((user: UserWithClaims) => (
                <EditableUserComp onEdit={onEditUser} user={user} key={user.userId}></EditableUserComp>
            ))}
            {
                currentViewingUser && (
                    createPortal(
                        <Modal title="Edit user details" footer=
                            {
                                <>
                                    <button className="button submit-button">Save</button>
                                    <button onClick={() => navigate("/admin/dashboard/users/")} className="button submit-button">Abort</button>
                                </>
                            } onClosed={() => navigate("/admin/dashboard/users/")}>
                            <div className="edit-user-details">
                                <p>User id: {currentViewingUser.userId}</p>
                                <p>Username: {currentViewingUser.userName}</p>
                                <p>Email: {currentViewingUser.email}</p>
                            </div>
                        </Modal>, document.body)
                )
            }
        </div>
    )

}

export default AdminUserManagementComp;