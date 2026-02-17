import "./CardDetailChecklistsComp.css"
import type {ChecklistItemGetDto} from "../../../../Models/BackendDtos/Kanban/ChecklistItemGetDto.ts";
import {type FormEvent, useEffect, useRef, useState} from "react";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";
import {useKanbanDispatch, useKanbanState} from "../../../../Contexts/Kanban/Hooks.ts";
import type { ChecklistItem } from "../../../../Models/States/types.ts";
import {API_BASE_URL} from "../../../../config/api.ts";
import CardDetailChecklistItemComp from "./CardDetailChecklistItemComp.tsx";
import {useParams} from "react-router-dom";
import CardDetailChecklistHeaderComp from "./CardDetailChecklistHeaderComp.tsx";
import {usePermissions} from "../../../../Contexts/Authorization/usePermissions.ts";

interface Props {
    checklistId: number;
}

const CardDetailChecklistComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const kanbanState = useKanbanState();
    const { boardId, cardId } = useParams();
    const permissions = usePermissions();

    const [showingCompletedTasks, setShowingCompletedTasks] = useState<boolean>(true);
    const checklistItems: ChecklistItem[] = [];
    Array.from(kanbanState.checklistItems.values()).forEach((checklistItem: ChecklistItem)=> {
        if (checklistItem.checklistId === props.checklistId) {
            checklistItems.push(checklistItem);
        }
    })

    const addingTaskInputRef = useRef<HTMLInputElement>(null);
    const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
    const [addingTaskInputValue, setAddingTaskInputValue] = useState<string>("");


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

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "DELETE_CHECKLIST_ITEM", payload: { checklistItemId: predictedChecklistItemId } })
            }
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/checklist/${props.checklistId}/item`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
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
            <CardDetailChecklistHeaderComp checklistId={props.checklistId} showingCompletedTasks={showingCompletedTasks}
                                           setShowingCompletedTasks={setShowingCompletedTasks}/>
            <div className="card-detail-progress-container">
                <p>{ checklistItems.length > 0 ? Math.floor(getCompletedTasksPercentage() * 100) : 0}%</p>
                <div className="card-detail-progress-bg">
                    <div className="card-detail-progress-fg" style={{ width: `${getCompletedTasksPercentage() * 100}%` }}/>
                </div>
            </div>
            <div className="card-detail-checklist-items">
                {checklistItems.map((checklistItem: ChecklistItemGetDto) => {
                    if (!showingCompletedTasks && checklistItem.isDone) return null;
                    return <CardDetailChecklistItemComp key={checklistItem.checklistItemId} checklistId={props.checklistId}
                                                        checklistItem={checklistItem}/>
                })}
            </div>
            { permissions.hasManageCardsPermission() && (
                <div className="card-detail-checklistitem-add">
                {
                    isAddingTask ? (
                        <form onSubmit={onAddTaskButtonPressed} onReset={cancelTaskAddition}>
                            <input ref={addingTaskInputRef} placeholder="Task name..." className="classic-input small"
                                   minLength={1} maxLength={256} required
                                   value={addingTaskInputValue}
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
            )}
        </div>
    )

}

export default CardDetailChecklistComp;