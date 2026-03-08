import {useEffect, useRef, useState} from "react";
import Popover from "../../../lib/Popover/Popover.tsx";
import AccountUserSelector from "../../User/UserSelector/AccountUserSelector.tsx";
import ConfirmationModal from "../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {useRealtimeHub} from "../../../Contexts/Realtime/Hooks.ts";
import {useKanbanDispatch} from "../../../Contexts/Kanban/Hooks.ts";
import type {Project, PublicUserGetDto} from "../../../Models/States/KanbanState.ts";
import DefaultUserSelectorUserComp from "../../User/UserSelector/DefaultUserSelectorUserComp.tsx";

interface Props {
    project: Project;
}

const ProjectManagerAddComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const hubConnection = useRealtimeHub();
    const dispatch = useKanbanDispatch();

    const [isAddingProjectManager, setIsAddingProjectManager] = useState<boolean>(false);
    const addProjectManagerDivRef = useRef<HTMLButtonElement | null>(null);

    const [addingSelectedUsers, setAddingSelectedUsers] = useState<PublicUserGetDto[]>(props.project.projectManagers);
    const [updatedProjectManagerStates, setUpdatedProjectManagerStates] = useState<Map<string, boolean>>(new Map());
    const [isSavingProjectManagerChanges, setIsSavingProjectManagerChanges] = useState<boolean>(false);

    useEffect(() => {

        if (!isAddingProjectManager && !isSavingProjectManagerChanges) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAddingSelectedUsers(props.project.projectManagers);
            setUpdatedProjectManagerStates(new Map());
        }

    }, [isAddingProjectManager, isSavingProjectManagerChanges, props.project.projectManagers]);

    async function saveChangesConfirmed() {

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        const body: {userId: string, newManagerState: boolean}[] = [];
        for (const [userId, newManagerState] of updatedProjectManagerStates.entries()) {
            body.push({ userId: userId, newManagerState: newManagerState });
        }

        fetch(`${API_BASE_URL}/project/${props.project.projectId}/managers`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to update project managers of project ${props.project.projectId}`);
                }

                return res.json();
            })
            .then((projectManagers: PublicUserGetDto[]) => {
                if (dispatch) {
                    dispatch({
                        type: "INIT_PROJECT_MANAGERS",
                        payload: { projectId: props.project.projectId, projectManagers: projectManagers }
                    })
                }
            })
            .catch(console.error)
            .finally(() => setIsSavingProjectManagerChanges(false))

    }

    function onUserSelected(user: PublicUserGetDto) {
        setAddingSelectedUsers((prev: PublicUserGetDto[]) => [...prev, user]);
        if (props.project.projectManagers.some((projectManager: PublicUserGetDto) => user.userId === projectManager.userId)) {
            updatedProjectManagerStates.delete(user.userId);
        } else {
            updatedProjectManagerStates.set(user.userId, true);
        }
    }

    function onUserUnselected(user: PublicUserGetDto) {
        setAddingSelectedUsers((prev: PublicUserGetDto[]) => {
            return prev.filter((addingSelectedUser: PublicUserGetDto) => addingSelectedUser.userId !== user.userId);
        });

        if (props.project.projectManagers.some((projectManager: PublicUserGetDto) => user.userId === projectManager.userId)) {
            updatedProjectManagerStates.set(user.userId, false);
        } else {
            updatedProjectManagerStates.delete(user.userId);
        }
    }

    function getConfirmSavingProjectManagerChangesJsx() {
        let newManagers = 0;
        let removedManagers = 0;
        for (const isManagerState of updatedProjectManagerStates.values()) {
            if (isManagerState) {
                newManagers++;
            } else {
                removedManagers++;
            }
        }

        return (
            <ConfirmationModal title="Confirm your action!" onConfirmed={saveChangesConfirmed} onClosed={() => {
                    setIsSavingProjectManagerChanges(false);
                    setIsAddingProjectManager(true);
                }} actionDescription={`If you confirm this action, ${newManagers} user${newManagers !== 1 ? "s" : ""} will be made managers of this project. ${removedManagers} user${removedManagers !== 1 ? "s" : ""} will have their manager rank removed from this board. You can undo this action at any time.`} ></ConfirmationModal>
        )
    }

    return (
        <>
            <button ref={addProjectManagerDivRef} onClick={() => setIsAddingProjectManager((prev: boolean) => !prev)} className="edit-project-modal-manager add">
                <p>+</p>
            </button>
            { isAddingProjectManager && (
                <Popover element={addProjectManagerDivRef} triggerElement={addProjectManagerDivRef} close={() => setIsAddingProjectManager(false)}>
                    <>
                        <AccountUserSelector selectedUsers={addingSelectedUsers} setSelectedUsers={setAddingSelectedUsers} child={DefaultUserSelectorUserComp}
                                             onUserSelected={onUserSelected} onUserUnselected={onUserUnselected}
                                             userSelectorOptions={{ showProjectOwner: true, showBoardOwner: false }}/>
                        <div className="add-project-manager-footer">
                            <button disabled={updatedProjectManagerStates.size <= 0} onClick={() => {
                                setIsAddingProjectManager(false);
                                setIsSavingProjectManagerChanges(true);
                            }} className={`button ${updatedProjectManagerStates.size > 0 ? "valid-submit-button" : "standard-button"}`}>Save</button>
                            <button onClick={() => setIsAddingProjectManager(false)} className="button standard-button">Cancel</button>
                        </div>
                    </>
                </Popover>
            )}
            { isSavingProjectManagerChanges && getConfirmSavingProjectManagerChangesJsx() }
        </>
    )
}

export default ProjectManagerAddComp;