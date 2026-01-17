import "./CardDetailChecklistsComp.css"
import type {ChecklistItemGetDto} from "../../../../Models/BackendDtos/GetDtos/ChecklistItemGetDto.ts";
import {type FormEvent, useEffect, useRef, useState} from "react";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";
import ConfirmationModal from "../../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {createPortal} from "react-dom";
import {useKanbanDispatch, useKanbanState} from "../../../../Contexts/Kanban/Hooks.ts";
import type { ChecklistItem } from "../../../../Models/States/types.ts";
import {API_BASE_URL} from "../../../../config/api.ts";
import CardDetailChecklistItemComp from "./CardDetailChecklistItemComp.tsx";

interface Props {
    cardId: number;
    checklistId: number;
}

const CardDetailChecklistComp = (props: Props) => {

    const { token, checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();

    const kanbanState = useKanbanState();
    const [showingCompletedTasks, setShowingCompletedTasks] = useState<boolean>(true);
    const checklist = kanbanState.checklists[props.checklistId];
    const checklistItems: ChecklistItem[] = [];
    Object.values(kanbanState.checklistItems).forEach((checklistItem: ChecklistItem)=> {
        if (checklistItem.checklistId === props.checklistId) {
            checklistItems.push(checklistItem);
        }
    })

    const addingTaskInputRef = useRef<HTMLInputElement>(null);
    const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
    const [addingTaskInputValue, setAddingTaskInputValue] = useState<string>("");
    const [isDeletingChecklist, setIsDeletingChecklist] = useState<boolean>(false);

    function getTotalTasks() {
        return checklistItems.length;
    }

    function getCompletedTasks() {
        let completedTasks = 0;
        for (const checklistItem of checklistItems) {
            if (checklistItem.isDone) {
                completedTasks++;
            }
        }
        return completedTasks;
    }

    function getCompletedTasksPercentage() {
        const totalTasks = getTotalTasks();
        const completedTasks = getCompletedTasks();
        return completedTasks / totalTasks;
    }

    async function deleteChecklist() {

        const succeeded = await checkRefresh();
        if (!succeeded) return;

        fetch(`${API_BASE_URL}/card/${props.cardId}/checklist/${props.checklistId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
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

    async function onAddTaskButtonPressed(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const predictedChecklistItemId = Date.now() * -1;

        if (dispatch) {
            dispatch({ type: "CREATE_CHECKLIST_ITEM_OPTIMISTIC", payload: {
                    checklistItemId: predictedChecklistItemId,
                    checklistItemName: addingTaskInputValue,
                    checklistId: props.checklistId
                }})
        }

        const succeeded = await checkRefresh();
        if (!succeeded) {
            if (dispatch) {
                dispatch({ type: "DELETE_CHECKLIST_ITEM", payload: { checklistItemId: predictedChecklistItemId } })
            }
            return;
        }

        fetch(`${API_BASE_URL}/checklist/${props.checklistId}/item`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ checklistItemName: addingTaskInputValue })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not create checklist item id on ${props.checklistId}`);
                }

                return res.json();
            })
            .then((checklistItem: ChecklistItemGetDto)=> {
                if (dispatch) {
                    dispatch({ type: "CREATE_CHECKLIST_ITEM_SUCCEEDED", payload: {
                        predictedChecklistItemId: predictedChecklistItemId,
                        actualChecklistItemId: checklistItem.checklistItemId
                    }})
                }
            })
            .catch(err => {
                console.error(err);
                if (dispatch) {
                    dispatch({ type: "DELETE_CHECKLIST_ITEM", payload: { checklistItemId: predictedChecklistItemId } })
                }
            })

        setAddingTaskInputValue("");
        setIsAddingTask(false);
    }



    function cancelTaskAddition() {
        setIsAddingTask(false);
        setAddingTaskInputValue("");
    }

    useEffect(() => {
        if (isAddingTask) {
            addingTaskInputRef.current?.focus();
        }
    }, [isAddingTask]);

    return (
        <div className="card-detail-checklist">
            <div className="card-detail-checklist-header">
                <p>{checklist.checklistName}</p>
                <div>
                    <button onClick={() => setShowingCompletedTasks(!showingCompletedTasks)} className="button standard-button">
                        { showingCompletedTasks ? "Hide completed" : "Show completed" }</button>
                    <div className="card-detail-checklist-img-container">
                        <img src="/public/trashcan-icon.svg" alt="Remove" height="40px"
                             onClick={() => setIsDeletingChecklist(true)}/>
                    </div>
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
            </div>
            <div className="card-detail-progress-container">
                <p>{ checklistItems.length > 0 ? Math.floor(getCompletedTasksPercentage() * 100) : 0}%</p>
                <div className="card-detail-progress-bg">
                    <div className="card-detail-progress-fg" style={{ width: `${getCompletedTasksPercentage() * 100}%` }}/>
                </div>
            </div>
            <div className="card-detail-checklist-items">
                {checklistItems.map((checklistItem: ChecklistItemGetDto) => {
                    if (!showingCompletedTasks && checklistItem.isDone) return null;
                    return <CardDetailChecklistItemComp key={checklistItem.checklistItemId} checklistItem={checklistItem}/>
                })}
            </div>
            <div className="card-detail-checklistitem-add">
                {
                    isAddingTask ? (
                        <form onSubmit={onAddTaskButtonPressed} onReset={cancelTaskAddition}>
                            <input ref={addingTaskInputRef} placeholder="Task name..." className="classic-input" minLength={1} maxLength={256}
                                   required value={addingTaskInputValue}
                                   onChange={(e) => setAddingTaskInputValue(e.target.value)}/>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button className={`button ${addingTaskInputValue.length > 0 ? "valid-submit-button" : "standard-button"}`}
                                        type="submit">Add task</button>
                                <button type="reset" className="button standard-button">Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <button onClick={() => setIsAddingTask(true)} className="card-detail-add-task-button">Add task</button>
                    )
                }
            </div>

        </div>
    )

}

export default CardDetailChecklistComp;