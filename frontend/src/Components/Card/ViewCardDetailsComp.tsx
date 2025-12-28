import Modal from "../../lib/Modal/Default/Modal.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useRef, useState} from "react";
import LabelSelector from "../Labels/LabelSelector.tsx";

const ViewCardDetailsComp = () => {

    const navigate = useNavigate();
    const { projectId, boardId } = useParams();
    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);
    const editLabelsButtonRef = useRef<HTMLButtonElement>(null);

    function onViewDetailsClosed() {
        navigate(`/projects/${projectId}/board/${boardId}`);
    }

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