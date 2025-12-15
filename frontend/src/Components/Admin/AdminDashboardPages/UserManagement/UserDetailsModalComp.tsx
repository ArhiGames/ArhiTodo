import Modal from "../../../../lib/Modal/Default/Modal.tsx";
import type { UserWithClaims } from "../../../../Models/Administration/UserWithClaims.ts";
import ClaimsOverviewComp from "./ClaimsOverviewComp.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Claim} from "../../../../Models/Claim.ts";
import { useAuth } from "../../../../Contexts/useAuth.ts";
import { createPortal } from "react-dom";
import ConfirmationModal from "../../../../lib/Modal/Confirmation/ConfirmationModal.tsx";

interface Props {
    currentViewingUser: UserWithClaims;
}

const UserDetailsModalComp = ( { currentViewingUser }: Props) => {

    const navigate = useNavigate();
    const { token } = useAuth();
    const { userId } = useParams();
    const [updatedClaims, setUpdatedClaims] = useState<Claim[]>([]);
    const [isTryingToDelete, setIsTryingToDelete] = useState<boolean>(false);

    const isViewingAdminUser = currentViewingUser?.userName === "admin";

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUpdatedClaims([]);
        if (!userId) {
            setIsTryingToDelete(false);
        }

    }, [userId]);

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

    function confirmUserDelete(password?: string) {

        if (!password) return;
        if (!currentViewingUser) return;
        if (password.length < 8) return;

        const abortController = new AbortController();
        fetch(`https://localhost:7069/api/account/admin/accountmanagement/users/${currentViewingUser.userId}`,
            {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify( { password: password } ),
                signal: abortController.signal,
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to delete user claims`);
                }

                navigate("/admin/dashboard/users/")
            })
            .catch(console.error);

        return () => abortController.abort();

    }

    return (
        <>
            <Modal title="Edit user details"
                   onClosed={() => navigate("/admin/dashboard/users/")}
                   footer={
                       <>
                           { !isViewingAdminUser &&
                               <button onClick={trySubmitChanges} className={`button ${updatedClaims.length > 0 ? "valid-submit-button" : "standard-button"}`}>Save</button> }
                           <button onClick={() => navigate("/admin/dashboard/users/")} className="button standard-button">Abort</button>
                           { !isViewingAdminUser && <button onClick={() => setIsTryingToDelete(true)} className="button heavy-action-button">Delete user</button> }
                       </> }>
                <div className="edit-user-claims">
                    <p>User id: {currentViewingUser.userId}</p>
                    <p>Username: {currentViewingUser.userName}</p>
                    <p>Email: {currentViewingUser.email}</p>
                    <ClaimsOverviewComp currentViewingUser={currentViewingUser}
                                        updatedClaims={updatedClaims} setUpdatedClaims={setUpdatedClaims}/>
                </div>
            </Modal>
            {
                isTryingToDelete && (
                    createPortal(
                        <ConfirmationModal onConfirmed={confirmUserDelete}
                                           onClosed={() => setIsTryingToDelete(false)}
                                           title="Confirm your identity!"
                                           actionDescription="To delete an user, authentication is required!"
                                           requirePassword={true}
                        />, document.body
                    )
                )
            }
        </>
    )

}

export default UserDetailsModalComp;