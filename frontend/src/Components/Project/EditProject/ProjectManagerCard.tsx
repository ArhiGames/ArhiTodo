import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import type {Project, PublicUserGetDto} from "../../../Models/States/KanbanState.ts";
import {useState} from "react";
import ConfirmationModal from "../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {useRealtimeHub} from "../../../Contexts/Realtime/Hooks.ts";
import GeneralUserViewerComp from "../../User/GeneralUserViewerComp.tsx";

interface Props {
    project: Project;
    projectManager: PublicUserGetDto;
    editable: boolean;
}

const ProjectManagerCard = (props: Props) => {

    const { appUser, checkRefresh } = useAuth();
    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const hubConnection = useRealtimeHub();

    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isMakingOwner, setIsMakingOwner] = useState<boolean>(false);

    const isOwner: boolean = kanbanState.projects.get(props.project.projectId)?.ownedByUserId === props.projectManager.userId;
    const isSelf: boolean = appUser?.id === props.projectManager.userId;
    const isSelfOwner: boolean = kanbanState.projects.get(props.project.projectId)?.ownedByUserId === appUser?.id;

    async function onMakeProjectOwnerConfirmed(password?: string) {

    }

    async function onDeleteProjectManagerConfirmed() {

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${props.project.projectId}/managers/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
            body: JSON.stringify([ { userId: props.projectManager.userId, newManagerState: false } ]),
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete project manager");
                }

                if (dispatch) {
                    dispatch({
                        type: "REMOVE_PROJECT_MANAGER",
                        payload: { projectId: props.project.projectId, projectManagerId: props.projectManager.userId }
                    })
                }
            })
            .catch(console.error);

    }

    return (
        <div className="edit-project-modal-manager">
            <div className="edit-project-modal-manager-information">
                <GeneralUserViewerComp user={props.projectManager} options={{ showProjectOwner: true, showBoardOwner: false }}/>
            </div>
            {
                props.editable && !isOwner && !isSelf && (
                    <>
                        <div style={{ display: "flex", gap: "0.2rem" }}>
                            { isSelfOwner && <button onClick={() => setIsMakingOwner(true)}
                                                     className="button standard-button">Make owner</button> }
                            <button onClick={() => setIsDeleting(true)} className="button standard-button">Remove</button>
                        </div>
                        { isMakingOwner && <ConfirmationModal title="Confirm your action!"
                                                              actionDescription={`If you confirm this action, ${props.projectManager.userName} will be the new owner of this project. You will remain project manager, but the new owner could technically remove you as project manager`}
                                                              onClosed={() => setIsMakingOwner(false)}
                                                              onConfirmed={onMakeProjectOwnerConfirmed}
                                                              requirePassword
                        /> }
                        { isDeleting && <ConfirmationModal title="Confirm your action!"
                                                           actionDescription={`If you confirm this action, ${props.projectManager.userName} will be removed as the project manager for this project. You can make them the project manager again at any time.`}
                                                           onClosed={() => setIsDeleting(false)}
                                                           onConfirmed={onDeleteProjectManagerConfirmed}/> }
                    </>
                )
            }

        </div>
    )

}

export default ProjectManagerCard;