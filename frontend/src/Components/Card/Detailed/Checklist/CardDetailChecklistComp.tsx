import "./CardDetailChecklistsComp.css"
import type {ChecklistItemGetDto} from "../../../../Models/BackendDtos/GetDtos/ChecklistItemGetDto.ts";
import type {ChecklistGetDto} from "../../../../Models/BackendDtos/GetDtos/ChecklistGetDto.ts";
import {type Dispatch, type SetStateAction, useEffect, useRef, useState} from "react";
import FancyCheckbox from "../../../../lib/Input/Checkbox/FancyCheckbox.tsx";
import type {DetailedCardGetDto} from "../../../../Models/BackendDtos/GetDtos/DetailedCardGetDto.ts";
import {API_BASE_URL} from "../../../../config/api.ts";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";
import ConfirmationModal from "../../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {createPortal} from "react-dom";
import {useKanbanDispatch} from "../../../../Contexts/Kanban/Hooks.ts";

interface Props {
    checklist: ChecklistGetDto;
    cardDetailComp: DetailedCardGetDto;
    setCardDetailComp: Dispatch<SetStateAction<DetailedCardGetDto | undefined>>;
    createChecklistLocally: () => void;
    deleteChecklistLocally: (checklistId: number) => void;
}

const CardDetailChecklistComp = (props: Props) => {

    const { token } = useAuth();
    const dispatch = useKanbanDispatch();
    const [showingCompletedTasks, setShowingCompletedTasks] = useState<boolean>(true);

    const addingTaskInputRef = useRef<HTMLInputElement>(null);
    const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
    const [addingTaskInputValue, setAddingTaskInputValue] = useState<string>("");

    const [isDeletingChecklist, setIsDeletingChecklist] = useState<boolean>(false);

    function getCompletedTasks() {
        let completedTasks: number = 0;
        for (const checklistItem of props.checklist.checklistItems) {
            if (checklistItem.isDone) {
                completedTasks++;
            }
        }
        return completedTasks;
    }

    function getCompletedTasksPercentage() {
        const completedTasks = getCompletedTasks();
        return completedTasks / props.checklist.checklistItems.length;
    }

    function patchDoneStateLocally(checklistItemId: number, checked: boolean) {

        const detailedCard: DetailedCardGetDto = {
            ...props.cardDetailComp,
            checklists: props.cardDetailComp.checklists.map((checklist: ChecklistGetDto) => {
                return props.checklist.checklistId === checklist.checklistId ? {
                    ...checklist,
                    checklistItems: checklist.checklistItems.map((checklistItem: ChecklistItemGetDto) => {
                        return checklistItem.checklistItemId === checklistItemId ? {
                            ...checklistItem,
                            isDone: checked,
                        } : checklistItem;
                    })
                } : checklist
            })
        }

        props.setCardDetailComp(detailedCard);
    }

    function addChecklistItemToChecklistLocally() {

        let predictedId: number = 0;
        for (const checklistItem of props.checklist.checklistItems) {
            if (predictedId < checklistItem.checklistItemId) {
                predictedId = checklistItem.checklistItemId;
            }
        }
        predictedId++;

        const checklistItemGetDto: ChecklistItemGetDto = { checklistItemId: predictedId, checklistItemName: addingTaskInputValue, isDone: false };

        props.setCardDetailComp((prev: DetailedCardGetDto | undefined) => {
            if (!prev) return prev;

            return {
                ...prev,
                checklists: prev.checklists.map((checklist: ChecklistGetDto) => {
                    return checklist.checklistId === props.checklist.checklistId ? {
                        ...checklist,
                        checklistItems: [
                            ...checklist.checklistItems,
                            checklistItemGetDto
                        ]
                    } : checklist
                })
            }
        });
        return predictedId;
    }

    function correctPredictedChecklistItem(predictedId: number, actual: ChecklistItemGetDto) {

        props.setCardDetailComp((prev: DetailedCardGetDto | undefined) => {
            if (!prev) return prev;

            return {
                ...prev,
                checklists: prev.checklists.map((checklist: ChecklistGetDto) => {
                    return props.checklist.checklistId === checklist.checklistId ? {
                        ...checklist,
                        checklistItems: checklist.checklistItems.map((checklistItem: ChecklistItemGetDto) => {
                            return checklistItem.checklistItemId === predictedId ? actual : checklistItem;
                        })
                    } : checklist
                })
            }
        } );
    }

    function deleteChecklistItemFromChecklistLocally(checklistItemId: number) {

        props.setCardDetailComp((prev: DetailedCardGetDto | undefined) => {
            if (!prev) return prev;

            return {
                ...prev,
                checklists: props.cardDetailComp.checklists.map((checklist: ChecklistGetDto) => {
                    return checklist.checklistId === props.checklist.checklistId ? {
                        ...checklist,
                        checklistItems: checklist.checklistItems.filter(
                            (checklistItem: ChecklistItemGetDto) => checklistItem.checklistItemId !== checklistItemId)
                    } : checklist
                })
            }
        });
    }

    function handleCheckboxClick(checklistItemId: number, checked: boolean) {
        patchDoneStateLocally(checklistItemId, checked);

        fetch(`${API_BASE_URL}/checklist/item/${checklistItemId}/done/${checked}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not patch checklist checked state")
                }

                return res.json();
            })
            .then((checklistItemGetDto: ChecklistItemGetDto) => {
                patchDoneStateLocally(checklistItemId, checklistItemGetDto.isDone);
                if (dispatch) {
                    dispatch({type: "CHANGE_UNDETAILED_TASK_STATE", payload: { cardId: props.cardDetailComp.cardId, newState: checklistItemGetDto.isDone }})
                }
            })
            .catch(err => {
                patchDoneStateLocally(checklistItemId, !checked);
                console.error(err);
            })

    }

    function onAddTaskButtonPressed() {
        if (!isAddingTask || addingTaskInputValue.length === 0) return;

        const predictedId: number = addChecklistItemToChecklistLocally();

        fetch(`${API_BASE_URL}/checklist/${props.checklist.checklistId}/item`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ "checklistItemName": addingTaskInputValue })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not create checklist-item!");
                }

                return res.json();
            })
            .then((checklistItemGetDto: ChecklistItemGetDto) => {
                correctPredictedChecklistItem(predictedId, checklistItemGetDto);
                if (dispatch) {
                    dispatch({type: "ADD_UNDETAILED_TASK_TO_CARD", payload: { taskToCardId: props.cardDetailComp.cardId }})
                }
            })
            .catch(err => {
                deleteChecklistItemFromChecklistLocally(predictedId);
                console.error(err);
            })

        setIsAddingTask(false);
        setAddingTaskInputValue("");
    }

    function deleteChecklist() {

        const totalTasks: number = props.checklist.checklistItems.length;
        let completedTasks: number = 0;
        for (const checklistItem of props.checklist.checklistItems) {
            if (checklistItem.isDone) {
                completedTasks++;
            }
        }

        fetch(`${API_BASE_URL}/card/${props.cardDetailComp.cardId}/checklist/${props.checklist.checklistId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not delete checklist!");
                }

                if (dispatch) {
                    for (let i = 0; i < totalTasks; i++) {
                        dispatch({ type: "REMOVE_UNDETAILED_TASK_FROM_CARD", payload: { taskFromCardId: props.cardDetailComp.cardId } })
                    }

                    for (let i = 0; i < completedTasks; i++) {
                        dispatch({ type: "CHANGE_UNDETAILED_TASK_STATE", payload: { cardId: props.cardDetailComp.cardId, newState: false } })
                    }
                }
                props.deleteChecklistLocally(props.checklist.checklistId);
            })
            .catch(err => {

                console.error(err);
            })

    }

    function cancelCardAddition() {
        setIsAddingTask(false);
        setAddingTaskInputValue("");
    }

    useEffect(() => {
        if (isAddingTask) {
            addingTaskInputRef.current?.focus();
        }
    }, [isAddingTask]);

    return (
        <div className="card-detail-checklist" key={props.checklist.checklistId}>
            <div className="card-detail-checklist-header">
                <p>{props.checklist.checklistName}</p>
                <div>
                    <button onClick={() => setShowingCompletedTasks(!showingCompletedTasks)} className="button standard-button">
                        { showingCompletedTasks ? "Hide completed" : "Show completed" }</button>
                    <button onClick={() => setIsDeletingChecklist(true)} className="button standard-button">Remove</button>
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
                <p>{ props.checklist.checklistItems.length > 0 ? Math.floor(getCompletedTasksPercentage() * 100) : 0}%</p>
                <div className="card-detail-progress-bg">
                    <div className="card-detail-progress-fg" style={{ width: `${getCompletedTasksPercentage() * 100}%` }}/>
                </div>
            </div>
            <div className="card-detail-checklist-items">
                {props.checklist.checklistItems.map((checklistItem: ChecklistItemGetDto) => {
                    if (!showingCompletedTasks && checklistItem.isDone) return null;
                    return (
                        <div key={checklistItem.checklistItemId} className="card-detail-checklist-item">
                            <FancyCheckbox value={checklistItem.isDone} onChange={(checked: boolean) =>
                                handleCheckboxClick(checklistItem.checklistItemId, checked)}/>
                            <p>{checklistItem.checklistItemName}</p>
                        </div>
                    )
                })}
            </div>
            <div className="card-detail-checklistitem-add">
                {
                    isAddingTask ? (
                        <form onSubmit={onAddTaskButtonPressed} onReset={cancelCardAddition}>
                            <input ref={addingTaskInputRef} placeholder="Task name..." className="classic-input" maxLength={256}
                                   value={addingTaskInputValue} onChange={(e) => setAddingTaskInputValue(e.target.value)}/>
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