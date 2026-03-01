import Modal from "../../../lib/Modal/Default/Modal.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import type {KanbanState} from "../../../Models/States/KanbanState.ts";
import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import ConfirmationModal from "../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../../config/api.ts";
import CardDetailChecklistsComp from "./Checklist/CardDetailChecklistsComp.tsx";
import "./DetailedCard.css"
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import ViewCardMembersComp from "./ViewCardMembersComp.tsx";
import ViewCardDescriptionComp from "./ViewCardDescriptionComp.tsx";
import ViewCardLabelsComp from "./ViewCardLabelsComp.tsx";
import ViewCardUrgencyComp from "./ViewCardUrgencyComp.tsx";
import {useRealtimeHub} from "../../../Contexts/Realtime/Hooks.ts";

const ViewCardDetailsComp = () => {

    const navigate = useNavigate();
    const { checkRefresh } = useAuth();
    const { projectId, boardId, cardId } = useParams();
    const kanbanState: KanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const permissions = usePermissions();
    const hubConnection = useRealtimeHub();

    const cardInputRef = useRef<HTMLInputElement>(null);
    const [inputtedCardName, setInputtedCardName] = useState<string>(kanbanState.cards.get(Number(cardId))?.cardName ?? "");

    const [isDeletingCard, setIsDeletingCard] = useState<boolean>(false);
    const [isSharing, setIsSharing] = useState<boolean>(false);

    const onViewDetailsClosed = useCallback(() => {
        navigate(`/projects/${projectId}/board/${boardId}`);
    }, [boardId, navigate, projectId]);

    useEffect(() => {

        if (!kanbanState.cards.has(Number(cardId))) {
            navigate(`/projects/${projectId}/board/${boardId}`);
            return;
        }

    }, [navigate, kanbanState.cards, cardId, projectId, boardId]);

    async function onEditCardNameEnterPressed(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            await onCardRenamed();
        }
    }

    async function onStateChanged() {

        if (!permissions.hasEditCardStatePermission(Number(cardId))) return;
        if (!dispatch) return;

        const newState: boolean = !(kanbanState.cards.get(Number(cardId))?.isDone);
        dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: Number(cardId), newState: newState } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: Number(cardId), newState: !newState } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/card/${Number(cardId)}/done/${newState}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch card state");
                }
            })
            .catch(err => {
                dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: Number(cardId), newState: !newState } });
                console.error(err);
            })
    }

    async function onCardRenamed() {
        if (inputtedCardName.length === 0 || !dispatch) return;
        cardInputRef.current?.blur();

        const oldCardName: string | undefined = kanbanState.cards.get(Number(cardId))?.cardName;
        if (!oldCardName) return;

        const newCardName: string = inputtedCardName;
        dispatch({ type: "UPDATE_CARD_NAME", payload: { cardId: Number(cardId), cardName: newCardName } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "UPDATE_CARD_NAME", payload: { cardId: Number(cardId), cardName: oldCardName } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/card/${Number(cardId)}/name`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
            body: JSON.stringify({ newCardName: newCardName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to rename card name");
                }
            })
            .catch(err => {
                dispatch({ type: "UPDATE_CARD_NAME", payload: { cardId: Number(cardId), cardName: oldCardName } });
                setInputtedCardName(oldCardName);
                console.error(err);
            })
    }

    async function onDeleteCardConfirmed() {

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/card/${cardId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete card");
                }

                if (dispatch) {
                    dispatch({ type: "DELETE_CARD", payload: { cardId: Number(cardId)} });
                }
            })
            .catch(err => {
                console.error(err);
            })
    }

    async function shareCardClicked() {
        setIsSharing(true);

        await navigator.clipboard.writeText(window.location.toString());

        setTimeout(() => {
            setIsSharing(false);
        }, 2000)
    }

    if (!kanbanState.cards.has(Number(cardId))) {
        return null;
    }

    return (
        <Modal modalSize="modal-large" onClosed={onViewDetailsClosed}
               header={
                   <>
                       {
                           <button disabled={!(permissions.hasEditCardStatePermission(Number(cardId)))} onClick={onStateChanged}
                                className="card-checkmark visible">
                               { kanbanState.cards.get(Number(cardId))?.isDone ? "✔" : "" }
                           </button>
                       }
                       { permissions.hasManageCardsPermission() ?
                           (<input className="card-detail-name" value={inputtedCardName}
                                   onKeyDown={onEditCardNameEnterPressed} ref={cardInputRef}
                                   onChange={(e) => setInputtedCardName(e.target.value)}
                                   onBlur={onCardRenamed} minLength={1} maxLength={256}/>) : (
                                <p>{inputtedCardName}</p>
                           )
                       }
                   </>
               }
               footer={
                   <div className="card-details-footer">
                       <div style={{ display: "flex", gap: "0.5rem" }}>
                           <button onClick={shareCardClicked} className="button standard-button">{ isSharing ? "Copied!" : "Share" }</button>
                           { permissions.hasManageCardsPermission() && (
                               <>
                                   <button className="button standard-button button-with-icon" onClick={() => setIsDeletingCard(true)}>
                                       <img src="/trashcan-icon.svg" alt="" className="icon" height="24px"/>
                                       <p>Delete</p>
                                   </button>
                                   { isDeletingCard && <ConfirmationModal title="Card deletion"
                                                                          actionDescription="If you confirm this action, this card will be deleted permanently."
                                                                          onConfirmed={onDeleteCardConfirmed} onClosed={() => setIsDeletingCard(false)} /> }
                               </>)}
                       </div>
                   </div>
            }>
            <div className="card-details-modal-wrapper">
                <div className="card-details-modal">
                    <p className="category-paragraph">Labels</p>
                    <ViewCardLabelsComp/>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <div>
                            <p className="category-paragraph">Urgency</p>
                            <ViewCardUrgencyComp/>
                        </div>
                        <div>
                            <p className="category-paragraph">Members</p>
                            <ViewCardMembersComp/>
                        </div>
                    </div>
                    <div className="card-detailed-description-div">
                        <p className="category-paragraph">Description</p>
                        <ViewCardDescriptionComp/>
                    </div>
                    <CardDetailChecklistsComp/>
                </div>
            </div>
        </Modal>
    )

}

export default ViewCardDetailsComp;