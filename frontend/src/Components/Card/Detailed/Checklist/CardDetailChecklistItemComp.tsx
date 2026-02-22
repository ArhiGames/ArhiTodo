import type {ChecklistItemGetDto} from "../../../../Models/BackendDtos/Kanban/ChecklistItemGetDto.ts";
import FancyCheckbox from "../../../../lib/Input/Checkbox/FancyCheckbox.tsx";
import {useKanbanDispatch, useKanbanState} from "../../../../Contexts/Kanban/Hooks.ts";
import {API_BASE_URL} from "../../../../config/api.ts";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";
import {type FormEvent, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {usePermissions} from "../../../../Contexts/Authorization/usePermissions.ts";
import type {ChecklistItem} from "../../../../Models/States/KanbanState.ts";

interface Props {
    checklistId: number;
    checklistItem: ChecklistItemGetDto;
}

const CardDetailChecklistItemComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const kanbanState = useKanbanState();
    const { boardId, cardId } = useParams();
    const permission = usePermissions();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const checklistItemInputRef = useRef<HTMLInputElement | null>(null);
    const checklistItemForm = useRef<HTMLFormElement | null>(null);
    const [checklistItemInput, setChecklistItemInput] = useState<string>(props.checklistItem.checklistItemName);

    async function handleCheckboxClick(checklistItemId: number, checked: boolean) {

        if (!permission.hasEditCardStatePermission(Number(cardId))) return;

        if (dispatch) {
            dispatch({
                type: "CHANGE_CHECKLIST_ITEM_STATE",
                payload: {
                    checklistItemId: checklistItemId,
                    newState: checked
                }
            });
        }

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "CHANGE_CHECKLIST_ITEM_STATE", payload: {
                        checklistItemId: checklistItemId,
                        newState: !checked
                    }});
            }
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/checklist/item/${checklistItemId}/done/${checked}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could update checklist item state with id ${props.checklistItem.checklistItemId}`);
                }

                return res.json();
            })
            .then((checklistItemGetDto: ChecklistItemGetDto) => {
                if (dispatch) {
                    dispatch({ type: "CHANGE_CHECKLIST_ITEM_STATE", payload: { checklistItemId: checklistItemId, newState: checklistItemGetDto.isDone } });
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "CHANGE_CHECKLIST_ITEM_STATE", payload: {
                            checklistItemId: checklistItemId,
                            newState: !checked
                        }});
                }
                console.error(err);
            })

    }

    async function handleChecklistItemRemovePressed(checklistItemId: number) {

        if (checklistItemId < 0) return;

        const checklistItem: ChecklistItem | undefined = kanbanState.checklistItems.get(checklistItemId);
        if (!checklistItem) return;

        if (dispatch) {
            dispatch({ type: "DELETE_CHECKLIST_ITEM", payload: { checklistItemId: checklistItemId } });
        }

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "CREATE_CHECKLIST_ITEM_OPTIMISTIC", payload: {
                        checklistItemId: checklistItemId,
                        checklistItemName: checklistItem.checklistItemName,
                        checklistId: checklistItem.checklistId,
                    }})
                dispatch({ type: "CHANGE_CHECKLIST_ITEM_STATE", payload: { checklistItemId: checklistItemId, newState: checklistItem.isDone } })
            }
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/checklist/${checklistItem.checklistId}/item/${checklistItemId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not delete checklist item with id ${checklistItemId}`);
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "CREATE_CHECKLIST_ITEM_OPTIMISTIC", payload: {
                            checklistItemId: checklistItemId,
                            checklistItemName: checklistItem.checklistItemName,
                            checklistId: checklistItem.checklistId,
                        }})
                    dispatch({ type: "CHANGE_CHECKLIST_ITEM_STATE", payload: { checklistItemId: checklistItemId, newState: checklistItem.isDone } })
                }
                console.error(err);
            })
    }

    async function handleChangeChecklistSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsEditing(false);
        if (checklistItemInput.length <= 0 || checklistItemInput === props.checklistItem.checklistItemName) {
            return;
        }

        const oldChecklistItemName: string = props.checklistItem.checklistItemName;

        if (dispatch) {
            dispatch({ type: "UPDATE_CHECKLIST_ITEM", payload: {
                checklistItemId: props.checklistItem.checklistItemId,
                checklistItemName: checklistItemInput,
                isDone: props.checklistItem.isDone
            }});
        }

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "UPDATE_CHECKLIST_ITEM", payload: {
                    checklistItemId: props.checklistItem.checklistItemId,
                    checklistItemName: oldChecklistItemName,
                    isDone: props.checklistItem.isDone
                }});
            }
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/checklist/${props.checklistId}/item`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({
                checklistItemId: props.checklistItem.checklistItemId,
                checklistItemName: checklistItemInput,
                isDone: props.checklistItem.isDone
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not update checklist item with id  ${props.checklistItem.checklistItemId}`);
                }

                return res.json();
            })
            .then((updatedChecklistItem: ChecklistItemGetDto) => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_CHECKLIST_ITEM", payload: {
                        checklistItemId: props.checklistItem.checklistItemId,
                        checklistItemName: updatedChecklistItem.checklistItemName,
                        isDone: updatedChecklistItem.isDone
                    }});
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_CHECKLIST_ITEM", payload: {
                        checklistItemId: props.checklistItem.checklistItemId,
                        checklistItemName: oldChecklistItemName,
                        isDone: props.checklistItem.isDone
                    }});
                }
                console.error(err);
            })
    }

    function resetChecklistItemUpdate() {
        setIsEditing(false);
        setChecklistItemInput(props.checklistItem.checklistItemName);
    }

    function tryEditChecklistItemPressed() {
        if (!permission.hasManageCardsPermission()) return;
        setIsEditing(true);
    }

    useEffect(() => {

        if (isEditing) {
            checklistItemInputRef.current?.focus();
        }

        const onClickedOutside = (e: MouseEvent) => {
            e.stopPropagation();

            if (!checklistItemForm.current) return;

            if (!checklistItemForm.current.contains(e.target as Node)) {
                setIsEditing(false);
                setChecklistItemInput("");
            }
        }

        document.addEventListener("mousedown", onClickedOutside);

        return () => document.removeEventListener("mousedown", onClickedOutside);

    }, [isEditing]);

    return (
        <div className="card-detail-checklist-item" onClick={tryEditChecklistItemPressed}>
            {
                isEditing ? (
                    <form ref={checklistItemForm} className="card-detail-checklist-item-info-wrapper"
                          onSubmit={handleChangeChecklistSubmit} onReset={resetChecklistItemUpdate}>
                        <div className="card-detail-checklist-item-info">
                            <FancyCheckbox value={props.checklistItem.isDone} onChange={(checked: boolean) =>
                                handleCheckboxClick(props.checklistItem.checklistItemId, checked)}/>
                            <input ref={checklistItemInputRef} type="text" className="classic-input small"
                                   minLength={1} maxLength={256} required
                                   value={checklistItemInput} onChange={(e) => setChecklistItemInput(e.target.value)}/>
                        </div>
                        <div className="card-detail-checklist-item-edit-actions">
                            <button type="submit"
                                    className={`button ${checklistItemInput.length > 0 && checklistItemInput !== props.checklistItem.checklistItemName
                                        ? "valid-submit-button" : "standard-button"}`}>Submit</button>
                            <button type="reset" className="button standard-button">Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        <div className="card-detail-checklist-item-info">
                            <FancyCheckbox value={props.checklistItem.isDone} onChange={(checked: boolean) =>
                                           handleCheckboxClick(props.checklistItem.checklistItemId, checked)}
                                           disabled={!permission.hasEditCardStatePermission(Number(cardId))}/>
                            <p className={props.checklistItem.isDone ? "checklist-item-name-done" : "checklist-item-name"}>{props.checklistItem.checklistItemName}</p>
                        </div>
                        { permission.hasManageCardsPermission() && (
                            <div className="card-detail-checklist-item-action">
                                <img height="32px" src="/trashcan-icon.svg" alt="Remove"
                                     onClick={() => handleChecklistItemRemovePressed(props.checklistItem.checklistItemId)}></img>
                            </div>
                        )}
                    </>
                )
            }
        </div>
    )

}

export default CardDetailChecklistItemComp;