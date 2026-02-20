import { useNavigate, useParams } from "react-router-dom";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type {Card, Label, State} from "../../Models/States/types.ts";
import { type Rgb, toRgb } from "../../lib/Functions.ts";
import {useState} from "react";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../config/api.ts";
import "./Card.css"
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";

interface Props {
    cardId: number;
}

const CardComp = (props: Props) => {

    const navigate = useNavigate();
    const kanbanState: State = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { checkRefresh } = useAuth();
    const { projectId, boardId } = useParams();
    const permissions = usePermissions();

    const card: Card | undefined = kanbanState.cards.get(props.cardId);

    const [isHovering, setIsHovering] = useState<boolean>(false);

    function openCard() {
        navigate(`/projects/${projectId}/board/${boardId}/card/${props.cardId}`);
    }

    async function onStateChange(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        if (!dispatch) return;

        const newState: boolean = !(kanbanState.cards.get(props.cardId)?.isDone);
        dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: props.cardId, newState: newState } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: props.cardId, newState: !newState } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/card/${props.cardId}/done/${newState}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch card state");
                }
            })
            .catch(err => {
                dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: props.cardId, newState: !newState } });
                console.error(err);
            })
    }

    function getTotalTasks(): number {
        let totalTasks = 0;
        for (const checklist of kanbanState.checklists.values()) {
            if (checklist.cardId === props.cardId) {
                for (const checklistItem of kanbanState.checklistItems.values()) {
                    if (checklistItem.checklistId === checklist.checklistId) {
                        totalTasks++;
                    }
                }
            }
        }
        return totalTasks;
    }

    function getTotalTasksCompleted(): number {
        let totalCompletedTasks = 0;
        for (const checklist of kanbanState.checklists.values()) {
            if (checklist.cardId === props.cardId) {
                for (const checklistItem of kanbanState.checklistItems.values()) {
                    if (checklistItem.checklistId === checklist.checklistId && checklistItem.isDone) {
                        totalCompletedTasks++;
                    }
                }
            }
        }
        return totalCompletedTasks;
    }

    function getCardLabelsJsx() {
        const labelIds: number[] | undefined = kanbanState.cardLabels.get(props.cardId);
        if (!labelIds) return null;

        return labelIds.map((labelId: number) => {
            const label: Label | undefined = kanbanState.labels.get(labelId);
            if (!label) return null;

            const color: Rgb = toRgb(label.labelColor);
            return (
                <div key={labelId} style={{ backgroundColor: `rgb(${color.red},${color.green},${color.blue})` }} className="card-label">
                    <p>{label.labelText}</p>
                </div>
            )
        })
    }

    return (
        <div onClick={openCard} className="card"
             onPointerEnter={() => setIsHovering(true)} onPointerLeave={() => setIsHovering(false)}>
            { kanbanState.cardLabels.get(props.cardId)!.length > 0 && (
                <div className="card-labels-div">
                    { getCardLabelsJsx() }
                </div>
            ) }
            <div style={{ display: "flex", alignItems: "center" }}>
                <button onClick={onStateChange} disabled={!(permissions.hasManageCardsPermission())}
                     className={`card-checkmark ${ (card?.isDone || isHovering) ? "visible" : "hidden" }`}>{ card?.isDone ? "✓" : "" }</button>
                <p className="card-name">{card?.cardName}</p>
                <button style={{ opacity: "0" }} className={`card-checkmark ${ (card?.isDone || isHovering) ? "hidden" : "visible" }`}/>
            </div>
            { (getTotalTasks() > 0) && (
                <div className="card-checklist-hint">
                    <p>✓ {getTotalTasksCompleted()} / {getTotalTasks()}</p>
                </div>
            ) }
        </div>
    )

}

export default CardComp;