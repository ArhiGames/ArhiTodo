import {type Dispatch, type FormEvent, type SetStateAction, useEffect, useRef, useState} from "react";
import {API_BASE_URL} from "../../../../config/api.ts";
import {useKanbanDispatch, useKanbanState} from "../../../../Contexts/Kanban/Hooks.ts";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";
import {useParams} from "react-router-dom";
import type {ChecklistGetDto} from "../../../../Models/BackendDtos/Kanban/ChecklistGetDto.ts";
import {createPortal} from "react-dom";
import ConfirmationModal from "../../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import * as React from "react";
import {usePermissions} from "../../../../Contexts/Authorization/usePermissions.ts";
import type {Checklist} from "../../../../Models/States/KanbanState.ts";

interface Props {
    checklistId: number;
    showingCompletedTasks: boolean;
    setShowingCompletedTasks: Dispatch<SetStateAction<boolean>>;
}

const CardDetailChecklistHeaderComp = (props: Props) => {

    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { checkRefresh } = useAuth();
    const checklist: Checklist = kanbanState.checklists.get(props.checklistId)!;
    const { boardId, cardId } = useParams();
    const permissions = usePermissions();

    const [isDeletingChecklist, setIsDeletingChecklist] = useState<boolean>(false);

    const checklistNameInputRef = useRef<HTMLInputElement | null>(null);
    const [isEditingChecklist, setIsEditingChecklist] = useState<boolean>(false);
    const [inputtedChecklistName, setInputtedChecklistName] = useState<string>(checklist.checklistName);

    function resetChecklistUpdate() {
        setIsEditingChecklist(false);
        setInputtedChecklistName(checklist.checklistName);
    }

    async function onChecklistUpdateSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        if (inputtedChecklistName.length <= 0 || inputtedChecklistName === checklist.checklistName) return;

        const oldChecklistName: string = checklist.checklistName;
        setIsEditingChecklist(false);

        if (dispatch) {
            dispatch({ type: "UPDATE_CHECKLIST", payload: { checklistId: props.checklistId, checklistName: inputtedChecklistName } })
        }

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "UPDATE_CHECKLIST", payload: { checklistId: props.checklistId, checklistName: oldChecklistName } })
            }
            setInputtedChecklistName(oldChecklistName);
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/checklist`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ checklistId: props.checklistId, checklistName: inputtedChecklistName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to update checklist with id ${props.checklistId}`);
                }

                return res.json();
            })
            .then((checklist: ChecklistGetDto) => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_CHECKLIST", payload: { checklistId: props.checklistId, checklistName: checklist.checklistName } })
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_CHECKLIST", payload: { checklistId: props.checklistId, checklistName: oldChecklistName } })
                }
                setInputtedChecklistName(oldChecklistName);
                console.error(err);
            })

    }

    async function deleteChecklist() {

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/checklist/${props.checklistId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not delete checklist with id ${props.checklistId}`);
                }

                if (dispatch) {
                    dispatch({ type: "DELETE_CHECKLIST", payload: { checklistId: props.checklistId } })
                }
            })
            .catch(err => {
                console.error(err);
            })

    }

    function onShowCompletedButtonPressed(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.stopPropagation();
        props.setShowingCompletedTasks((prev: boolean) => !prev);
    }

    function onTryDeleteChecklistButtonPressed(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.stopPropagation();
        setIsDeletingChecklist(true);
    }

    function tryEditChecklistPressed() {
        if (!permissions.hasManageCardsPermission()) return;
        setIsEditingChecklist(true);
    }

    useEffect(() => {
        if (isEditingChecklist) {
            checklistNameInputRef.current?.focus();
        }
    }, [isEditingChecklist]);

    return (
        <div onClick={tryEditChecklistPressed} className="card-detail-checklist-header">
            {
                isEditingChecklist ? (
                    <div className="card-detail-checklist-editing">
                        <form onSubmit={onChecklistUpdateSubmit} onReset={resetChecklistUpdate}>
                            <input ref={checklistNameInputRef} className="classic-input small"
                                   value={inputtedChecklistName} onChange={(e) => setInputtedChecklistName(e.target.value)}
                                   maxLength={32} minLength={1} required/>
                            <button type="submit"
                                    className={`button ${inputtedChecklistName.length > 0 && inputtedChecklistName !== checklist.checklistName
                                        ? "valid-submit-button" : "standard-button"}`}>Submit</button>
                            <button type="reset" className="button standard-button">Cancel</button>
                        </form>
                    </div>
                ) : (
                    <>
                        <p>{checklist.checklistName}</p>
                        <div className="card-detail-checklist-header-actions">
                            <img onClick={onShowCompletedButtonPressed} className="icon" height="38px"
                                 alt={props.showingCompletedTasks ? "Hide completed" : "Show completed"}
                                 src={props.showingCompletedTasks ? "/crossed-eye.svg" : "/eye.svg" }/>
                            { permissions.hasManageCardsPermission() && (
                                <>
                                    <div className="card-detail-checklist-img-container">
                                        <img src="/trashcan-icon.svg" alt="Remove" height="32px" className="icon"
                                            onClick={onTryDeleteChecklistButtonPressed}/>
                                        {
                                            isDeletingChecklist && (
                                                createPortal(
                                                    <ConfirmationModal title="Confirm your action!"
                                                                       actionDescription="If you confirm this action, the checklist will be irrevocably deleted."
                                                                       onClosed={() => setIsDeletingChecklist(false)}
                                                                       onConfirmed={deleteChecklist}/>, document.body)
                                            )
                                        }
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )
            }
        </div>
    )

}

export default CardDetailChecklistHeaderComp;