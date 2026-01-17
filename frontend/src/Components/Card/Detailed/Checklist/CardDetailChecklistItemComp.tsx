import type {ChecklistItemGetDto} from "../../../../Models/BackendDtos/GetDtos/ChecklistItemGetDto.ts";
import FancyCheckbox from "../../../../lib/Input/Checkbox/FancyCheckbox.tsx";
import {useKanbanDispatch, useKanbanState} from "../../../../Contexts/Kanban/Hooks.ts";
import {API_BASE_URL} from "../../../../config/api.ts";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";

interface Props {
    checklistItem: ChecklistItemGetDto;
}

const CardDetailChecklistItemComp = (props: Props) => {

    const { token, checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const kanbanState = useKanbanState();

    async function handleCheckboxClick(checklistItemId: number, checked: boolean) {

        if (dispatch) {
            dispatch({ type: "CHANGE_CHECKLIST_ITEM_STATE", payload: {
                    checklistItemId: checklistItemId,
                    newState: checked
                }});
        }

        const succeeded = await checkRefresh();
        if (!succeeded) {
            if (dispatch) {
                dispatch({ type: "CHANGE_CHECKLIST_ITEM_STATE", payload: {
                        checklistItemId: checklistItemId,
                        newState: !checked
                    }});
            }
            return;
        }

        fetch(`${API_BASE_URL}/checklist/item/${checklistItemId}/done/${checked}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
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

        const checklistItem = kanbanState.checklistItems[checklistItemId];

        if (dispatch) {
            dispatch({ type: "DELETE_CHECKLIST_ITEM", payload: { checklistItemId: checklistItemId } });
        }

        const succeeded = await checkRefresh();
        if (!succeeded) {
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

        fetch(`${API_BASE_URL}/checklist/${checklistItem.checklistId}/item/${checklistItemId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
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

    return (
        <div className="card-detail-checklist-item">
            <div className="card-detail-checklist-item-info">
                <FancyCheckbox value={props.checklistItem.isDone} onChange={(checked: boolean) =>
                    handleCheckboxClick(props.checklistItem.checklistItemId, checked)}/>
                <p>{props.checklistItem.checklistItemName}</p>
            </div>
            <div className="card-detail-checklist-item-action">
                <img height="32px" src="/public/trashcan-icon.svg" alt="Remove"
                     onClick={() => handleChecklistItemRemovePressed(props.checklistItem.checklistItemId)}></img>
            </div>
        </div>
    )

}

export default CardDetailChecklistItemComp;