import Modal from "../../../lib/Modal/Default/Modal.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {type FormEvent, Fragment, useCallback, useEffect, useRef, useState} from "react";
import LabelSelector from "../../Labels/LabelSelector.tsx";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import type {DetailedCardGetDto} from "../../../Models/BackendDtos/Kanban/DetailedCardGetDto.ts";
import type {Label, State} from "../../../Models/States/types.ts";
import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {type Rgb, toRgb} from "../../../lib/Functions.ts";
import ConfirmationModal from "../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../../config/api.ts";
import CardDetailChecklistsComp from "./Checklist/CardDetailChecklistsComp.tsx";
import "./DetailedCard.css"
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";

const ViewCardDetailsComp = () => {

    const navigate = useNavigate();
    const { token, checkRefresh } = useAuth();
    const { projectId, boardId, cardId } = useParams();
    const kanbanState: State = useKanbanState();
    const dispatch = useKanbanDispatch();
    const permissions = usePermissions();

    const currentEditLabelRef = useRef<HTMLElement>(null);
    const [detailedCard, setDetailedCard] = useState<DetailedCardGetDto>();

    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);
    const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);

    const descriptionInputRef = useRef<HTMLTextAreaElement | null>(null);

    const [cardDescription, setCardDescription] = useState<string>("");
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

    useEffect(() => {
        if (cardId == undefined) return;

        const abortController = new AbortController();

        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            fetch(`${API_BASE_URL}/card/${cardId}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
                    signal: abortController.signal,
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
                    if (err.name === "AbortError") {
                        return;
                    }
                    onViewDetailsClosed();
                    console.error(err);
                })
        }

        run();

        return () => abortController.abort();

    }, [boardId, cardId, projectId, token, checkRefresh, onViewDetailsClosed]);

    useEffect(() => {

        if (isEditingDescription) {
            if (!descriptionInputRef.current) return;

            descriptionInputRef.current.focus();
            descriptionInputRef.current.setSelectionRange(cardDescription.length, cardDescription.length);
        }

    }, [isEditingDescription]);

    function getPureLabelIds() {
        const labelIds: number[] = [];
        if (!detailedCard) return [];

        for (const labelId of kanbanState.cardLabels.get(Number(cardId))!) {
            labelIds.push(labelId);
        }

        return labelIds;
    }

    async function onLabelSelected(labelId: number) {
        if (!dispatch || !cardId) return;

        dispatch({ type: "ADD_LABEL_TO_CARD_OPTIMISTIC", payload: { cardId: Number(cardId), labelId: labelId } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "REMOVE_LABEL_FROM_CARD", payload: { cardId: Number(cardId), labelId: labelId } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${Number(cardId)}/label/${labelId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to add card label");
                }
            })
            .catch(err => {
                dispatch({ type: "REMOVE_LABEL_FROM_CARD", payload: { cardId: Number(cardId), labelId: labelId } });
                console.error(err);
            })
    }

    async function onLabelUnselected(labelId: number) {
        if (!dispatch || !cardId) return;

        dispatch({ type: "REMOVE_LABEL_FROM_CARD", payload: { cardId: Number(cardId), labelId: labelId } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "ADD_LABEL_TO_CARD_OPTIMISTIC", payload: { cardId: Number(cardId), labelId: labelId } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${Number(cardId)}/label/${labelId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete card label");
                }
            })
            .catch(err => {
                dispatch({ type: "ADD_LABEL_TO_CARD_OPTIMISTIC", payload: { cardId: Number(cardId), labelId: labelId } });
                console.error(err);
            })
    }

    async function onStateChanged() {

        if (!permissions.hasManageCardsPermission()) return;
        if (!dispatch || !detailedCard) return;

        const newState: boolean = !(kanbanState.cards.get(detailedCard.cardId)?.isDone);
        dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: detailedCard.cardId, newState: newState } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: detailedCard.cardId, newState: !newState } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/card/${detailedCard.cardId}/done/${newState}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch card state");
                }
            })
            .catch(err => {
                dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: detailedCard.cardId, newState: !newState } });
                console.error(err);
            })
    }

    async function onCardRenamed() {
        if (inputtedCardName.length === 0 || !detailedCard || !dispatch) return;

        const oldCardName: string | undefined = kanbanState.cards.get(detailedCard.cardId)?.cardName;
        if (!oldCardName) return;

        const newCardName: string = inputtedCardName;
        dispatch({ type: "UPDATE_CARD_NAME", payload: { cardId: detailedCard.cardId, cardName: newCardName } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "UPDATE_CARD_NAME", payload: { cardId: detailedCard.cardId, cardName: oldCardName } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/card/${detailedCard.cardId}/name`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ newCardName: newCardName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to rename card name");
                }
            })
            .catch(err => {
                dispatch({ type: "UPDATE_CARD_NAME", payload: { cardId: detailedCard.cardId, cardName: oldCardName } });
                setInputtedCardName(oldCardName);
                console.error(err);
            })
    }

    async function updateCardDescription(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (cardDescription.length === 0 || !detailedCard) return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/card/${detailedCard.cardId}/description`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ newCardDescription: cardDescription })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to update card description");
                }

                return res.json();
            })
            .then((detailedCard: DetailedCardGetDto) => {
                setDetailedCard((prev: DetailedCardGetDto | undefined) => {
                    if (!prev) return;

                    return {
                        ...prev,
                        cardDescription: detailedCard.cardDescription,
                    }
                });
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

    async function onDeleteCardConfirmed() {

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${Number(projectId)}/board/${Number(boardId)}/card/${cardId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
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

    function onEditCardDescriptionPressed() {
        if (!permissions.hasManageCardsPermission()) return;
        setIsEditingDescription(true);
    }

    function onLabelSelectedClicked(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        currentEditLabelRef.current = e.currentTarget;
        setIsEditingLabels(!isEditingLabels);
    }

    function cardLabelsJsx() {
        return (
            <>
                {
                    kanbanState.cardLabels.has(Number(cardId)) && (
                        kanbanState.cardLabels.get(Number(cardId))?.map((labelId: number) => {
                            const label: Label | undefined = kanbanState.labels.get(labelId);
                            if (!label) return null;
                            const color: Rgb = toRgb(label.labelColor);
                            return (
                                <div style={{ backgroundColor: `rgb(${color.red},${color.green},${color.blue})` }}
                                     key={label.labelId} className="detailed-card-label"
                                     onClick={onLabelSelectedClicked}>
                                    {label.labelText}
                                </div>
                            )
                        }))
                }
                { permissions.hasManageCardsPermission() && <button onClick={onLabelSelectedClicked}
                                                     className="button standard-button">+</button> }
                {
                    isEditingLabels && <LabelSelector element={currentEditLabelRef}
                                                      actionTitle="Edit card labels"
                                                      onClose={() => setIsEditingLabels(false)}
                                                      onLabelSelected={onLabelSelected}
                                                      onLabelUnselected={onLabelUnselected}
                                                      selectedLabels={getPureLabelIds()}
                                                      selectable={permissions.hasManageCardsPermission()}/>
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
                            <textarea value={cardDescription} ref={descriptionInputRef}
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
                        <p onClick={onEditCardDescriptionPressed}
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
        <Modal modalSize="modal-large" onClosed={onViewDetailsClosed}
               header={
                   <>
                       {
                           detailedCard && (
                               <button disabled={!(permissions.hasManageCardsPermission())} onClick={onStateChanged}
                                    className="card-checkmark visible">
                                   { kanbanState.cards.get(detailedCard.cardId)?.isDone ? "✓" : "" }
                               </button>
                           )
                       }
                       { permissions.hasManageCardsPermission() ?
                           (<input className="card-detail-name" value={inputtedCardName}
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
                    <div className="card-details-labels">
                        { cardLabelsJsx() }
                    </div>
                    <div className="card-detailed-description-div">
                        <p className="category-paragraph">Label description</p>
                        { cardDescriptionJsx() }
                    </div>
                    { detailedCard && <CardDetailChecklistsComp/> }
                </div>
            </div>
        </Modal>
    )

}

export default ViewCardDetailsComp;