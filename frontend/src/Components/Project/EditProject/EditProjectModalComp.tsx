import Modal from "../../../lib/Modal/Default/Modal.tsx";
import type {Project} from "../../../Models/States/types.ts";
import {useState} from "react";
import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../../config/api.ts";
import type {ProjectGetDto} from "../../../Models/BackendDtos/Kanban/ProjectGetDto.ts";
import {createPortal} from "react-dom";
import ConfirmationModal from "../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import "./EditProject.css"
import EditProjectProjectManagersComp from "./EditProjectProjectManagersComp.tsx";

interface Props {
    onClose: () => void;
    project: Project;
}

const EditProjectModalComp = (props: Props) => {

    const { jwtPayload, appUser, checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const kanbanState = useKanbanState();

    const [projectName, setProjectName] = useState<string>(props.project.projectName);
    const [isTryingToDelete, setIsTryingToDelete] = useState<boolean>(false);

    async function handleProjectNameInputBlurred() {

        if (projectName.length <= 0) return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        const oldName: string = props.project.projectName;
        if (dispatch) {
            dispatch({type: "UPDATE_PROJECT", payload: {projectId: props.project.projectId, projectName: projectName}})
        }

        fetch(`${API_BASE_URL}/project`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ projectId: props.project.projectId, projectName: projectName }),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to update project")
                }

                return res.json();
            })
            .then((projectGetDto: ProjectGetDto) => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_PROJECT", payload: { projectId: projectGetDto.projectId, projectName: projectGetDto.projectName }});
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_PROJECT", payload: { projectId: props.project.projectId, projectName: oldName }});
                    setProjectName(oldName);
                }
                console.error(err);
            })

    }

    async function onDeleteProjectConfirmed() {

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${props.project.projectId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete project")
                }

                if (dispatch) {
                    dispatch({type: "DELETE_PROJECT", payload: { projectId: props.project.projectId }})
                }
            })
            .catch(console.error);

        props.onClose();
    }

    function mayDeleteProject(): boolean {
        const mayModifyOthersProjectsGlobally = jwtPayload?.ModifyOthersProjects === "true";
        const isProjectOwner = kanbanState.projects[props.project.projectId]?.ownedByUserId === appUser?.id;
        return mayModifyOthersProjectsGlobally || isProjectOwner;
    }
    mayDeleteProject();

    return (
        <>
            <Modal modalSize="modal-large" onClosed={props.onClose} header={
                <input className="classic-input" style={{ width: "100%", marginRight: "1rem" }} onBlur={handleProjectNameInputBlurred}
                       value={projectName} maxLength={32} onChange={(e) => setProjectName(e.target.value)}/>
            } footer={
                <>
                    { mayDeleteProject() && (
                        <button onClick={() => setIsTryingToDelete(true)} className="button standard-button iconized-button">
                            <img className="icon" height="32px" src="/trashcan-icon.svg" alt="Delete"/>
                            <p>Remove</p>
                        </button>
                    )}
                </>
            }>
                <div className="edit-project-modal">
                    <EditProjectProjectManagersComp project={props.project}/>
                </div>
            </Modal>
            { isTryingToDelete && (
                createPortal(<ConfirmationModal title="Authorization required!" actionDescription="If you confirm this action, the project will be permanently deleted. Please consider this action carefully!"
                                                onConfirmed={onDeleteProjectConfirmed} onClosed={() => setIsTryingToDelete(false)}/>, document.body)
            ) }
        </>
    )

}

export default EditProjectModalComp;