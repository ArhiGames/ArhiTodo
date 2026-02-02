import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import type {Project} from "../../../Models/States/types.ts";
import {type Dispatch, type SetStateAction, useState} from "react";
import ConfirmationModal from "../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";

interface Props {
    project: Project;
    projectManager: UserGetDto;
    projectManagers: UserGetDto[];
    setProjectManagers: Dispatch<SetStateAction<UserGetDto[]>>
}

const ProjectManagerCard = (props: Props) => {

    const { checkRefresh } = useAuth();
    const kanbanState = useKanbanState();

    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const isOwner = kanbanState.projects[props.project.projectId]?.ownedByUserId === props.projectManager.userId;

    async function onDeleteProjectManagerConfirmed() {

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${props.project.projectId}/managers/${props.projectManager.userId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete project manager");
                }

                props.setProjectManagers(props.projectManagers.filter(pm => pm.userId !== props.projectManager.userId));
            })
            .catch(console.error);

    }

    return (
        <div className="edit-project-modal-manager">
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    { isOwner && <p className="project-manager-label">Project owner</p> }
                    <h4>{props.projectManager.userName}</h4>
                </div>
                <p style={{ opacity: "75%" }}>{props.projectManager.email}</p>
            </div>
            <button onClick={() => setIsDeleting(true)} className="button standard-button">Remove</button>
            { isDeleting && <ConfirmationModal title="Confirm your action!"
                                               actionDescription="If you confirm this action, this user will be removed as the project manager for this project. You can make them the project manager again at any time."
                                               onClosed={() => setIsDeleting(false)}
                                               onConfirmed={onDeleteProjectManagerConfirmed}/> }
        </div>
    )

}

export default ProjectManagerCard;