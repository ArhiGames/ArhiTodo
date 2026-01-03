import Modal from "../../lib/Modal/Default/Modal.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {type FormEvent, Fragment, useEffect, useRef, useState} from "react";
import LabelSelector from "../Labels/LabelSelector.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {DetailedCardGetDto} from "../../Models/BackendDtos/GetDtos/DetailedCardGetDto.ts";
import type {Label, State} from "../../Models/States/types.ts";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import {type Rgb, toRgb} from "../../lib/Functions.ts";
import ConfirmationModal from "../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../config/api.ts";
import CardDetailChecklistsComp from "./CardDetailChecklistsComp.tsx";

const ViewCardDetailsComp = () => {

    const navigate = useNavigate();
    const { token } = useAuth();
    const { projectId, boardId, cardId } = useParams();
    const kanbanState: State = useKanbanState();
    const dispatch = useKanbanDispatch();
    const editLabelsButtonRef = useRef<HTMLButtonElement>(null);
    const [detailedCard, setDetailedCard] = useState<DetailedCardGetDto>();
    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);
    const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
    const [cardDescription, setCardDescription] = useState<string>("");
    const [inputtedCardName, setInputtedCardName] = useState<string>(kanbanState.cards[Number(cardId)].cardName);

    const [isDeletingCard, setIsDeletingCard] = useState<boolean>(false);
    const [isSharing, setIsSharing] = useState<boolean>(false);

    function onViewDetailsClosed() {
        navigate(`/projects/${projectId}/board/${boardId}`);
    }

    useEffect(() => {
        if (cardId == undefined) return;

        fetch(`${API_BASE_URL}/card/${cardId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch detailed card");
                }

                return res.json();
            })
            .then((detailedCard: DetailedCardGetDto) => {
                setDetailedCard(detailedCard);
                setCardDescription(detailedCard.cardDescription);
            })
            .catch(err => {
                onViewDetailsClosed();
                console.error(err);
            })

    }, [boardId, cardId, projectId, token]);

    function getPureLabelIds() {
        const labelIds: number[] = [];
        if (!detailedCard) return [];

        for (const labelId of kanbanState.cardLabels[Number(cardId)]) {
            labelIds.push(labelId);
        }

        return labelIds;
    }

    function onLabelSelected(label: Label) {
        if (!dispatch || !cardId) return;

        dispatch({ type: "ADD_LABEL_TO_CARD_OPTIMISTIC", payload: { cardId: Number(cardId), labelId: label.labelId } });

        fetch(`${API_BASE_URL}/card/${Number(cardId)}/label/${label.labelId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to add card label");
                }
            })
            .catch(err => {
                dispatch({ type: "REMOVE_LABEL_FROM_CARD", payload: { cardId: Number(cardId), labelId: label.labelId } });
                console.error(err);
            })
    }

    function onLabelUnselected(label: Label) {
        if (!dispatch || !cardId) return;

        dispatch({ type: "REMOVE_LABEL_FROM_CARD", payload: { cardId: Number(cardId), labelId: label.labelId } });

        fetch(`${API_BASE_URL}/card/${Number(cardId)}/label/${label.labelId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete card label");
                }
            })
            .catch(err => {
                dispatch({ type: "ADD_LABEL_TO_CARD_OPTIMISTIC", payload: { cardId: Number(cardId), labelId: label.labelId } });
                console.error(err);
            })
    }

    function onCardRenamed() {
        if (inputtedCardName.length === 0 || !detailedCard || !dispatch) return;

        const newCardName: string = inputtedCardName;
        dispatch({ type: "UPDATE_CARD_NAME", payload: { cardId: detailedCard.cardId, cardName: newCardName } });

        fetch(`${API_BASE_URL}/card/${detailedCard.cardId}/name`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ cardName: newCardName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to rename card name");
                }
            })
            .catch(err => {
                dispatch({ type: "UPDATE_CARD_NAME", payload: { cardId: detailedCard.cardId, cardName: kanbanState.cards[detailedCard.cardId].cardName } });
                console.error(err);
            })
    }

    function updateCardDescription(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (cardDescription.length === 0 || !detailedCard) return;

        fetch(`${API_BASE_URL}/card/${detailedCard.cardId}/description`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ cardDescription: cardDescription })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to update card description");
                }

                return res.json();
            })
            .then((detailedCard: DetailedCardGetDto) => {
                setDetailedCard(detailedCard);
            })
            .catch(err => {
                console.error(err);
            })

        setIsEditingDescription(false);
    }

    function resetCardDescription(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!detailedCard) return;

        setCardDescription(detailedCard.cardDescription);
        setIsEditingDescription(false);
    }

    function onDeleteCardConfirmed() {

        if (dispatch) {
            dispatch({ type: "DELETE_CARD", payload: { cardId: Number(cardId)} });
            navigate(`/projects/${projectId}/board/${boardId}`);
        }

        fetch(`${API_BASE_URL}/card/${cardId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete card");
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

    function cardLabelsJsx() {
        return (
            <>
                {
                    kanbanState.cardLabels[Number(cardId)] && (
                        Object.values(kanbanState.cardLabels[Number(cardId)]).map((labelId: number) => {
                            const label: Label = kanbanState.labels[labelId];
                            if (!label) return null;
                            const color: Rgb = toRgb(label.labelColor);
                            return (
                                <div style={{ backgroundColor: `rgb(${color.red},${color.green},${color.blue})` }}
                                     key={label.labelId} className="detailed-card-label"
                                     onClick={() => setIsEditingLabels(!isEditingLabels)}>
                                    {label.labelText}
                                </div>
                            )
                        }))
                }
                <button ref={editLabelsButtonRef} onClick={() => setIsEditingLabels(!isEditingLabels)}
                        className="button standard-button">+</button>
                {
                    isEditingLabels && <LabelSelector element={editLabelsButtonRef} projectId={Number(projectId)} boardId={Number(boardId)}
                                                      actionTitle="Edit card labels"
                                                      onClose={() => setIsEditingLabels(false)}
                                                      onLabelSelected={onLabelSelected}
                                                      onLabelUnselected={onLabelUnselected}
                                                      selectedLabels={getPureLabelIds()}/>
                }
            </>
        )
    }

    function cardDescriptionJsx() {
        return (
            <form onSubmit={updateCardDescription} onReset={resetCardDescription}>
                {
                    isEditingDescription ? (
                        <>
                            <textarea value={cardDescription}
                                      placeholder="This card currently does not have a description..."
                                      onChange={(e) => setCardDescription(e.target.value)}
                                      maxLength={8192}/>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button className={`button ${ detailedCard && cardDescription !== detailedCard.cardDescription ?
                                    "valid-submit-button" : "standard-button" }`}
                                        type="submit">Save description</button>
                                <button type="reset" className="button standard-button">Cancel</button>
                            </div>
                        </>
                    ) : (
                        <p onClick={() => setIsEditingDescription(true)}
                           className="card-detailed-description">{ cardDescription.length > 0 ?
                            cardDescription.split('\n').map((line, idx) => (
                                <Fragment key={idx}>
                                    {line}
                                    <br/>
                                </Fragment>
                            )) : "This card currently does not have a description..." }</p>
                    )
                }
            </form>
        )
    }

    return (
        <Modal modalSize="modal-large" title="Edit card details" onClosed={onViewDetailsClosed}
               footer={<></>}>
            <div className="card-details-modal-wrapper">
                <div className="card-details-modal">
                    <p className="category-paragraph">Label name</p>
                    <input className="card-detail-name" value={inputtedCardName}
                           onChange={(e) => setInputtedCardName(e.target.value)}
                           onBlur={onCardRenamed}
                           minLength={1} maxLength={90}/>
                    <p className="category-paragraph">Labels</p>
                    <div className="card-details-labels">
                        { cardLabelsJsx() }
                    </div>
                    <div className="card-detailed-description-div">
                        <p className="category-paragraph">Label description</p>
                        { cardDescriptionJsx() }
                    </div>
                    <div className="card-detail-checklists-div">
                        <p className="category-paragraph">Tasks</p>
                        {
                            detailedCard && <CardDetailChecklistsComp cardDetailComp={detailedCard} setCardDetailComp={setDetailedCard}/>
                        }
                    </div>
                </div>
                <div className="card-details-footer">
                    <p>Actions</p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={shareCardClicked} className="button standard-button">{ isSharing ? "Copied!" : "Share" }</button>
                        <button className="button heavy-action-button" onClick={() => setIsDeletingCard(true)}>Delete</button>
                        { isDeletingCard && <ConfirmationModal title="Card deletion"
                                                               actionDescription="If you confirm this action, this card will be deleted permanently."
                                                               onConfirmed={onDeleteCardConfirmed} onClosed={() => setIsDeletingCard(false)} /> }
                    </div>
                </div>
            </div>
        </Modal>
    )

}

export default ViewCardDetailsComp;