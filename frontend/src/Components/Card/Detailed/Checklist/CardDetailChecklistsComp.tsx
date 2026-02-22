import type {ChecklistGetDto} from "../../../../Models/BackendDtos/Kanban/ChecklistGetDto.ts";
import "./CardDetailChecklistsComp.css"
import CardDetailChecklistComp from "./CardDetailChecklistComp.tsx";
import Popover from "../../../../lib/Popover/Popover.tsx";
import {type FormEvent, useEffect, useRef, useState} from "react";
import {API_BASE_URL} from "../../../../config/api.ts";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";
import {useKanbanDispatch, useKanbanState} from "../../../../Contexts/Kanban/Hooks.ts";
import type {Checklist} from "../../../../Models/States/KanbanState.ts";
import {useParams} from "react-router-dom";
import {usePermissions} from "../../../../Contexts/Authorization/usePermissions.ts";

const CardDetailChecklistsComp = () => {

    const { checkRefresh } = useAuth();
    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { boardId, cardId } = useParams();
    const permissions = usePermissions();

    const addChecklistButtonRef = useRef<HTMLButtonElement>(null);
    const addChecklistNameInputRef = useRef<HTMLInputElement>(null);
    const [isAddingChecklist, setIsAddingChecklist] = useState<boolean>(false);
    const [inputtedChecklistName, setInputtedChecklistName] = useState<string>("");

    async function onCreateChecklistSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        const predictedChecklistId: number = Date.now() * -1;

        if (dispatch) {
            dispatch({
                type: "CREATE_CHECKLIST_OPTIMISTIC", payload: {
                    checklistId: predictedChecklistId,
                    checklistName: inputtedChecklistName,
                    cardId: Number(cardId),
                }
            })
        }

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/card/${cardId}/checklist`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ checklistName: inputtedChecklistName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to create checklist")
                }

                return res.json();
            })
            .then((checklist: ChecklistGetDto) => {
                if (dispatch) {
                    dispatch({
                        type: "CREATE_CHECKLIST_SUCCEEDED",
                        payload: {predictedChecklistId: predictedChecklistId, actualChecklistId: checklist.checklistId}
                    })
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "DELETE_CHECKLIST", payload: { checklistId: predictedChecklistId } });
                }
                console.error(err);
            })

        setIsAddingChecklist(false);
        setInputtedChecklistName("");

    }

    useEffect(() => {
        if (isAddingChecklist) {
            addChecklistNameInputRef.current?.focus();
        }
    }, [isAddingChecklist]);

    return (
        <div className="card-detail-checklists-div">
            <div className="card-details-checklist-header">
                <p>Checklists</p>
                {
                    permissions.hasManageCardsPermission() && (
                        <>
                            <button ref={addChecklistButtonRef} onClick={() => setIsAddingChecklist(true)} className="button standard-button">+</button>
                            {
                                isAddingChecklist && (
                                    <Popover close={() => setIsAddingChecklist(false)} element={addChecklistButtonRef} closeIfClickedOutside>
                                        <form className="card-detail-add-checklist-form" onSubmit={onCreateChecklistSubmit} onReset={() => setIsAddingChecklist(false)}>
                                            <input ref={addChecklistNameInputRef} placeholder="Checklist name..." className="classic-input"
                                                   value={inputtedChecklistName}
                                                   maxLength={32} minLength={1} required
                                                   onChange={(e) => setInputtedChecklistName(e.target.value)}/>
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button className={`button ${inputtedChecklistName.length > 0 ? "valid-submit-button" : "standard-button"}`}
                                                        type="submit">Create</button>
                                                <button className="button standard-button" type="reset">Cancel</button>
                                            </div>
                                        </form>
                                    </Popover>
                                )
                            }
                        </>
                    )
                }
            </div>
            {
                Array.from(kanbanState.checklists.values()).map((checklist: Checklist) => {
                    if (checklist.cardId !== Number(cardId)) return null;
                    return <CardDetailChecklistComp key={checklist.checklistId} checklistId={checklist.checklistId}/>
                })
            }
        </div>
    )

}

export default CardDetailChecklistsComp;