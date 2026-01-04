import { type FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Modal from "../../lib/Modal/Default/Modal.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type { ProjectGetDto } from "../../Models/BackendDtos/GetDtos/ProjectGetDto.ts";
import { useNavigate } from "react-router-dom";
import {API_BASE_URL} from "../../config/api.ts";

const CreateNewProjectCardComp = () => {

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>("");
    const projectNameInputRef = useRef<HTMLInputElement>(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    function onNewProjectClicked() {
        setIsCreating(true);
    }

    function onClose() {
        setIsCreating(false);
    }

    function onCreateProjectSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        fetch(`${API_BASE_URL}/project`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ projectName: projectName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to create project");
                }

                return res.json();
            })
            .then((createdProject: ProjectGetDto) => {
                navigate(`/projects/${createdProject.projectId}/board`)
            })
            .catch(console.error);

    }

    useEffect(() => {

        if (isCreating) {
            projectNameInputRef.current?.focus();
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setProjectName("");
        }

    }, [isCreating]);

    return (
        <>
            <div onClick={onNewProjectClicked} className="create-project-card project-card">
                <h1>+</h1>
            </div>
            {
                isCreating && (
                    createPortal(
                        <Modal header={<h2>Create new project</h2>} modalSize="modal-small" onClosed={onClose}
                               footer={<></>}>
                            <div className="create-new-board-modal">
                                <form onSubmit={onCreateProjectSubmit}>
                                    <label>Project name</label>
                                    <input ref={projectNameInputRef} placeholder="Project name" className="classic-input"
                                        value={projectName} onChange={(e) => setProjectName(e.target.value)}/>
                                    <button type="submit" className={`button ${projectName.length > 0 ? "valid-submit-button" : "standard-button"}`}>Create</button>
                                </form>
                            </div>
                        </Modal>
                    , document.body)
                )
            }
        </>
    )
}

export default CreateNewProjectCardComp;