import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {useRealtimeHub} from "../../../../Contexts/Realtime/Hooks.ts";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";
import {useKanbanDispatch} from "../../../../Contexts/Kanban/Hooks.ts";
import {API_BASE_URL} from "../../../../config/api.ts";
import type {ChecklistItemGetDto} from "../../../../Models/BackendDtos/Kanban/ChecklistItemGetDto.ts";

interface Props {
    checklistId: number;
}

const CardDetailAddChecklistItemComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const { boardId, cardId } = useParams();
    const hubConnection = useRealtimeHub();

    const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
    const [addingTaskInputValue, setAddingTaskInputValue] = useState<string>("");

    const addingTaskInputRef = useRef<HTMLInputElement>(null);
    const scrollTarget = useRef<HTMLDivElement>(null);

    function scrollIntoView() {
        scrollTarget.current?.scrollIntoView({ block: "end", inline: "nearest", behavior: "smooth" });
    }

    useEffect(() => {
        if (isAddingTask) {
            setTimeout(() => {
                scrollIntoView();
                addingTaskInputRef.current?.focus()
            }, 0);
        }
    }, [isAddingTask]);

    async function onAddTaskButtonPressed(e: React.SubmitEvent<HTMLFormElement>) {
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
                dispatch({ type: "DELETE_CHECKLIST_ITEM", checklistItemId: predictedChecklistItemId })
            }
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/checklist/${props.checklistId}/item`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
            body: JSON.stringify({ checklistItemName: addingTaskInputValue })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not create checklist item id on ${props.checklistId}`);
                }

                return res.json();
            })
            .then((checklistItem: ChecklistItemGetDto) => {
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
                    dispatch({ type: "DELETE_CHECKLIST_ITEM", checklistItemId: predictedChecklistItemId })
                }
            })

        setAddingTaskInputValue("");
        scrollIntoView();
    }

    function cancelTaskAddition() {
        setIsAddingTask(false);
        setAddingTaskInputValue("");
    }

    return (
        <div className="card-detail-checklistitem-add">
            {isAddingTask ? (
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
                )}
            <div ref={scrollTarget}/>
        </div>
    )

}

export default CardDetailAddChecklistItemComp;