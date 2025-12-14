import { useEffect, useState } from "react";
import { useAuth } from "../../../../Contexts/useAuth.ts";
import type { UserWithClaims } from "../../../../Models/Administration/UserWithClaims.ts";
import EditableUserComp from "../EditableUserComp.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { createPortal } from "react-dom";
import Modal from "../../../../lib/Modal/Modal.tsx";
import ClaimsOverviewComp from "./ClaimsOverviewComp.tsx";
import type { Claim } from "../../../../Models/Claim.ts";

const AdminUserManagementComp = () => {

    const navigate = useNavigate();
    const { token } = useAuth();
    const { userId } = useParams();
    const [users, setUsers] = useState<UserWithClaims[]>([]);
    const [currentViewingUser, setCurrentViewingUser] = useState<UserWithClaims | null>(null);
    const [updatedClaims, setUpdatedClaims] = useState<Claim[]>([]);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUpdatedClaims([]);

    }, [userId]);

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

    function trySubmitChanges() {

        if (updatedClaims.length <= 0) return;
        if (!currentViewingUser) return;

        const abortController = new AbortController();
        fetch(`https://localhost:7069/api/account/admin/accountmanagement/users/${currentViewingUser.userId}`,
            {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                signal: abortController.signal,
                body: JSON.stringify(updatedClaims)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to update user claims`);
                }

                navigate("/admin/dashboard/users/");
            })
            .catch(console.error);

        return () => abortController.abort();

    }

    return (
        <div className="admin-settings-content admin-usermanagement-page">
            <h2>User management</h2>
            <p>Manage user permissions, delete & add users</p>
            {users.map((user: UserWithClaims) => (
                <EditableUserComp canEdit={user.userName !== "admin"} onEdit={onEditUser} user={user} key={user.userId}/>
            ))}
            {
                currentViewingUser && (
                    createPortal(
                        <Modal title="Edit user details" footer={
                            <>
                                { currentViewingUser.userName === "admin" ? null :
                                    <button onClick={trySubmitChanges} className={`button ${updatedClaims.length > 0 ? "valid-submit-button" : "submit-button"}`}>Save</button> }
                                <button onClick={() => navigate("/admin/dashboard/users/")} className="button submit-button">Abort</button>
                            </> }
                            onClosed={() => navigate("/admin/dashboard/users/")}>
                            <div className="edit-user-claims">
                                <p>User id: {currentViewingUser.userId}</p>
                                <p>Username: {currentViewingUser.userName}</p>
                                <p>Email: {currentViewingUser.email}</p>
                                <ClaimsOverviewComp currentViewingUser={currentViewingUser}
                                                    updatedClaims={updatedClaims} setUpdatedClaims={setUpdatedClaims}/>
                            </div>
                        </Modal>, document.body)
                )
            }
        </div>
    )

}

export default AdminUserManagementComp;