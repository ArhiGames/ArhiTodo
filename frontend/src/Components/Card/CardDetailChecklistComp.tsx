import "./CardDetailChecklistsComp.css"
import type {ChecklistItemGetDto} from "../../Models/BackendDtos/GetDtos/ChecklistItemGetDto.ts";
import type {ChecklistGetDto} from "../../Models/BackendDtos/GetDtos/ChecklistGetDto.ts";
import { useEffect, useRef, useState } from "react";
import FancyCheckbox from "../../lib/Input/Checkbox/FancyCheckbox.tsx";
import type {DetailedCardGetDto} from "../../Models/BackendDtos/GetDtos/DetailedCardGetDto.ts";
import {API_BASE_URL} from "../../config/api.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";

interface Props {
    checklist: ChecklistGetDto;
    cardDetailComp: DetailedCardGetDto;
    setCardDetailComp: (detailedCard: DetailedCardGetDto) => void;
}

const CardDetailChecklistComp = (props: Props) => {

    const { token } = useAuth();
    const [showingCompletedTasks, setShowingCompletedTasks] = useState<boolean>(true);

    const addingTaskInputRef = useRef<HTMLInputElement>(null);
    const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
    const [addingTaskInputValue, setAddingTaskInputValue] = useState<string>("");

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

        const detailedCard: DetailedCardGetDto = {
            ...props.cardDetailComp,
            checklists: props.cardDetailComp.checklists.map((checklist: ChecklistGetDto) => {
                return checklist.checklistId === props.checklist.checklistId ? {
                    ...checklist,
                    checklistItems: [
                        ...checklist.checklistItems,
                        checklistItemGetDto
                    ]
                } : checklist
            })
        }

        props.setCardDetailComp(detailedCard);
        return predictedId;
    }

    function correctPredictedChecklistItem(predictedId: number, actual: ChecklistItemGetDto) {

        const detailedCard: DetailedCardGetDto = {
            ...props.cardDetailComp,
            checklists: props.cardDetailComp.checklists.map((checklist: ChecklistGetDto) => {
                return props.checklist.checklistId === checklist.checklistId ? {
                    ...checklist,
                    checklistItems: checklist.checklistItems.map((checklistItem: ChecklistItemGetDto) => {
                        return checklistItem.checklistItemId === predictedId ? actual : checklistItem;
                    })
                } : checklist
            })
        }

        props.setCardDetailComp(detailedCard);

    }

    function deleteChecklistItemFromChecklistLocally(checklistItemId: number) {
        const detailedCard: DetailedCardGetDto = {
            ...props.cardDetailComp,
            checklists: props.cardDetailComp.checklists.map((checklist: ChecklistGetDto) => {
                return checklist.checklistId === props.checklist.checklistId ? {
                    ...checklist,
                    checklistItems: checklist.checklistItems.filter(
                        (checklistItem: ChecklistItemGetDto) => checklistItem.checklistItemId !== checklistItemId)
                } : checklist
            })
        }

        props.setCardDetailComp(detailedCard);
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
            })
            .catch(err => {
                deleteChecklistItemFromChecklistLocally(predictedId);
                console.error(err);
            })

        setIsAddingTask(false);
        setAddingTaskInputValue("");
    }

    function cancelCardAddition() {
        setIsAddingTask(false);
        setAddingTaskInputValue("");
    }

    useEffect(() => {
        addingTaskInputRef.current?.focus();
    }, [isAddingTask]);

    return (
        <div className="card-detail-checklist" key={props.checklist.checklistId}>
            <div className="card-detail-checklist-header">
                <p>{props.checklist.checklistName}</p>
                <div>
                    <button onClick={() => setShowingCompletedTasks(!showingCompletedTasks)} className="button standard-button">
                        { showingCompletedTasks ? "Hide completed tasks" : "Show completed tasks" }</button>
                    <button className="button standard-button">Remove</button>
                </div>
            </div>
            <div className="card-detail-progress-container">
                <p>{Math.floor(getCompletedTasksPercentage() * 100)}%</p>
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