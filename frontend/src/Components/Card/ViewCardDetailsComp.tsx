import Modal from "../../lib/Modal/Default/Modal.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import LabelSelector from "../Labels/LabelSelector.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {DetailedCardGetDto} from "../../Models/BackendDtos/GetDtos/DetailedCardGetDto.ts";

const ViewCardDetailsComp = () => {

    const navigate = useNavigate();
    const { token } = useAuth();
    const { projectId, boardId, cardId } = useParams();
    const [detailedCard, setDetailedCard] = useState<DetailedCardGetDto>();
    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);
    const editLabelsButtonRef = useRef<HTMLButtonElement>(null);

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

    }, [cardId]);

    return (
        <Modal modalSize="modal-large" title="Edit card details" onClosed={onViewDetailsClosed}
               footer={
                    <>
                        <button className="button standard-button">Save Changes</button>
                    </>
               }>
            <div className="card-details-modal">
                <div className="card-details-labels">
                    <p>Labels</p>
                    <button ref={editLabelsButtonRef} onClick={() => setIsEditingLabels(!isEditingLabels)}
                            className="button standard-button">+</button>
                    { isEditingLabels && <LabelSelector element={editLabelsButtonRef} projectId={Number(projectId)} boardId={Number(boardId)}
                                        actionTitle="Edit card labels" onClose={() => setIsEditingLabels(false)}/> }
                </div>
            </div>
        </Modal>
    )

}

export default ViewCardDetailsComp;