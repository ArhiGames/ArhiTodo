import {type Dispatch, type SetStateAction, useEffect, useRef, useState} from "react";
import Popover from "../../../lib/Popover/Popover.tsx";
import AccountUserSelector from "../../User/UserSelector/AccountUserSelector.tsx";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import ProjectManagerAddUserComp from "./ProjectManagerAddUserComp.tsx";
import ConfirmationModal from "../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../../config/api.ts";
import {matchPath} from "react-router-dom";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";

interface Props {
    projectManagers: UserGetDto[];
    setProjectManagers: Dispatch<SetStateAction<UserGetDto[]>>
}

const ProjectManagerAddComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const match = matchPath({ path: "/projects/:projectId/*" }, location.pathname);

    const [isAddingProjectManager, setIsAddingProjectManager] = useState<boolean>(false);
    const addProjectManagerDivRef = useRef<HTMLButtonElement | null>(null);

    const [addingSelectedUsers, setAddingSelectedUsers] = useState<UserGetDto[]>(props.projectManagers);
    const [updatedProjectManagerStates, setUpdatedProjectManagerStates] = useState<{ userId: string, newManagerState: boolean }[]>([]);
    const [isSavingProjectManagerChanges, setIsSavingProjectManagerChanges] = useState<boolean>(false);

    useEffect(() => {

        // Looping over every current project manager, if the manager isn't in the selected ones, it must be unselected.
        const newUpdatedManagerStates: { userId: string, newManagerState: boolean }[] = [];
        for (const projectManager of props.projectManagers) {
            if (addingSelectedUsers.findIndex(user => user.userId === projectManager.userId) === -1) {
                newUpdatedManagerStates.push({ userId: projectManager.userId, newManagerState: false });
            }
        }

        // Looping over the currently selected adding users, if the adding user currently isn't a manager, it must be selected.
        for (const addingUser of addingSelectedUsers) {
            if (props.projectManagers.findIndex(pm => pm.userId === addingUser.userId) === -1) {
                newUpdatedManagerStates.push({ userId: addingUser.userId, newManagerState: true });
            }
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUpdatedProjectManagerStates(newUpdatedManagerStates);

    }, [props.projectManagers, addingSelectedUsers]);

    useEffect(() => {

        if (!isAddingProjectManager && !isSavingProjectManagerChanges) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAddingSelectedUsers(props.projectManagers);
            setUpdatedProjectManagerStates([]);
        }

    }, [isAddingProjectManager, isSavingProjectManagerChanges, props.projectManagers]);

    async function saveChangesConfirmed() {

        if (!match) return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${match.params.projectId}/managers`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify(updatedProjectManagerStates)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to update project managers of project ${match.params.projectId}`);
                }

                return res.json();
            })
            .then((projectManagers: UserGetDto[]) => {
                props.setProjectManagers(projectManagers);
            })
            .catch(console.error)
            .finally(() => setIsSavingProjectManagerChanges(false))

    }

    function getConfirmSavingProjectManagerChangesJsx() {
        let newManagers = 0;
        let removedManagers = 0;
        for (const updatedProjectManagerState of updatedProjectManagerStates) {
            if (updatedProjectManagerState.newManagerState) {
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
            <button ref={addProjectManagerDivRef} onClick={() => setIsAddingProjectManager(true)} className="edit-project-modal-manager add">
                <p>+</p>
            </button>
            { isAddingProjectManager && (
                    <Popover element={addProjectManagerDivRef} close={() => setIsAddingProjectManager(false)} closeIfClickedOutside>
                        <>
                            <AccountUserSelector selectedUsers={addingSelectedUsers} setSelectedUsers={setAddingSelectedUsers} child={ProjectManagerAddUserComp}/>
                            <div className="add-project-manager-footer">
                                <button disabled={updatedProjectManagerStates.length <= 0} onClick={() => {
                                    setIsAddingProjectManager(false);
                                    setIsSavingProjectManagerChanges(true);
                                }} className={`button ${updatedProjectManagerStates.length > 0 ? "valid-submit-button" : "standard-button"}`}>Save</button>
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