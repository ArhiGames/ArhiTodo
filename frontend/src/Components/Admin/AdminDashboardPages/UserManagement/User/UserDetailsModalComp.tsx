import Modal from "../../../../../lib/Modal/Default/Modal.tsx";
import ClaimsOverviewComp from "./ClaimsOverviewComp.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Claim} from "../../../../../Models/Claim.ts";
import { useAuth } from "../../../../../Contexts/Authentication/useAuth.ts";
import { createPortal } from "react-dom";
import ConfirmationModal from "../../../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL, AUTH_BASE_URL} from "../../../../../config/api.ts";
import type {UserGetDto} from "../../../../../Models/BackendDtos/Auth/UserGetDto.ts";

interface Props {
    currentViewingUser: UserGetDto;
    setCurrentViewingUser: (newViewing: UserGetDto) => void;
}

const UserDetailsModalComp = ( { currentViewingUser, setCurrentViewingUser }: Props) => {

    const navigate = useNavigate();
    const { appUser, checkRefresh } = useAuth();
    const { userId } = useParams();
    const [updatedClaims, setUpdatedClaims] = useState<Claim[]>([]);
    const [isTryingToDelete, setIsTryingToDelete] = useState<boolean>(false);

    const isViewingAdminUser = currentViewingUser?.userName === "admin";
    const isSelf: boolean = appUser?.id === userId;

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

        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            fetch(`${API_BASE_URL}/user/${userId}/claims`,
                {
                    method: "PUT",
                    headers: { "Authorization": `Bearer ${refreshedToken}`, "Content-Type": "application/json" },
                    signal: abortController.signal,
                    body: JSON.stringify(updatedClaims)
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Failed to update user claims`);
                    }
                    return res.json();
                })
                .then((claims: Claim[]) => {
                    setCurrentViewingUser({ ...currentViewingUser, userClaims: claims });
                    setUpdatedClaims([]);
                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        return;
                    }
                    console.error(err);
                });
        }

        run();

        return () => abortController.abort();

    }

    async function confirmUserDelete(password?: string) {

        if (!password) return;
        if (!currentViewingUser) return;
        if (password.length < 8 && password !== "admin") return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${AUTH_BASE_URL}/accounts/user/${currentViewingUser.userId}`,
            {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${refreshedToken}`, "Content-Type": "application/json" },
                body: JSON.stringify( { password: password } )
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to delete user claims`);
                }

                navigate("/admin/dashboard/users/")
            })
            .catch(console.error);

    }

    return (
        <>
            <Modal header={<h2>Edit user details</h2>}
                   modalSize="modal-large"
                   onClosed={() => navigate("/admin/dashboard/users/")}
                   footer={
                       <>
                           { (!isSelf && !isViewingAdminUser) &&
                               <button onClick={trySubmitChanges} className={`button ${updatedClaims.length > 0 ? "valid-submit-button" : "standard-button"}`}>Save</button> }
                           <button onClick={() => navigate("/admin/dashboard/users/")} className="button standard-button">Abort</button>
                           { (!isSelf && !isViewingAdminUser) &&
                               <button onClick={() => setIsTryingToDelete(true)} className="button standard-button button-with-icon">
                                   <img src="/trashcan-icon.svg" alt="" className="icon" height="24px"/>
                                   <p>Delete user</p>
                               </button> }
                       </>
                   }>
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
                                           requirePassword/>, document.body
                    )
                )
            }
        </>
    )

}

export default UserDetailsModalComp;