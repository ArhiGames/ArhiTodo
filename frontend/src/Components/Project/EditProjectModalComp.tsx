import Modal from "../../lib/Modal/Default/Modal.tsx";
import type {Project} from "../../Models/States/types.ts";
import {useState} from "react";
import {useKanbanDispatch} from "../../Contexts/Kanban/Hooks.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../config/api.ts";
import type {ProjectGetDto} from "../../Models/BackendDtos/GetDtos/ProjectGetDto.ts";

interface Props {
    onClose: () => void;
    project: Project;
}

const EditProjectModalComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const [projectName, setProjectName] = useState<string>(props.project.projectName);
    const dispatch = useKanbanDispatch();

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
                }
                console.error(err);
            })

    }

    return (
        <Modal modalSize="modal-large" onClosed={props.onClose} header={
            <input className="classic-input" style={{ width: "100%", marginRight: "1rem" }} onBlur={handleProjectNameInputBlurred}
                   value={projectName} onChange={(e) => setProjectName(e.target.value)}/>
        } footer={
            <div className="edit-project-modal-footer">
            </div>
        }>
            <div className="edit-project-modal">

            </div>
        </Modal>
    )

}

export default EditProjectModalComp;