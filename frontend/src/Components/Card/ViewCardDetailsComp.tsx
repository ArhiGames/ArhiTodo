import Modal from "../../lib/Modal/Default/Modal.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import LabelSelector from "../Labels/LabelSelector.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {DetailedCardGetDto} from "../../Models/BackendDtos/GetDtos/DetailedCardGetDto.ts";
import type {Label, State} from "../../Models/States/types.ts";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import {type Rgb, toRgb} from "../../lib/Functions.ts";

const ViewCardDetailsComp = () => {

    const navigate = useNavigate();
    const { token } = useAuth();
    const { projectId, boardId, cardId } = useParams();
    const [detailedCard, setDetailedCard] = useState<DetailedCardGetDto>();
    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);
    const editLabelsButtonRef = useRef<HTMLButtonElement>(null);
    const kanbanState: State = useKanbanState();
    const dispatch = useKanbanDispatch();

    function onViewDetailsClosed() {
        navigate(`/projects/${projectId}/board/${boardId}`);
    }

    useEffect(() => {
        if (cardId == undefined) return;

        fetch(`https://localhost:7069/api/project/${projectId}/board/${boardId}/card/${cardId}`,
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

        fetch(`https://localhost:7069/api/card/${Number(cardId)}/label/${label.labelId}`,
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

        fetch(`https://localhost:7069/api/card/${Number(cardId)}/label/${label.labelId}`,
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

    return (
        <Modal modalSize="modal-large" title="Edit card details" onClosed={onViewDetailsClosed}
               footer={
                    <>
                        <button className="button standard-button">Save Changes</button>
                    </>
               }>
            <div className="card-details-modal">
                <p>Labels</p>
                <div className="card-details-labels">
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
                </div>
                <p>Label description</p>
                <textarea placeholder={ detailedCard && detailedCard.cardDescription.length > 0 ?
                    detailedCard.cardDescription : "Card detail description..."}></textarea>
            </div>
        </Modal>
    )

}

export default ViewCardDetailsComp;