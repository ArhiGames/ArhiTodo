import type { CardGetDto } from "../../Models/BackendDtos/Kanban/CardGetDto.ts";
import { useNavigate, useParams } from "react-router-dom";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type { Label, State } from "../../Models/States/types.ts";
import { type Rgb, toRgb } from "../../lib/Functions.ts";
import {useState} from "react";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../config/api.ts";
import type {ChecklistGetDto} from "../../Models/BackendDtos/Kanban/ChecklistGetDto.ts";
import "./Card.css"

const CardComp = (props: { card: CardGetDto }) => {

    const navigate = useNavigate();
    const kanbanState: State = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { checkRefresh } = useAuth();
    const { projectId, boardId } = useParams();
    const [isHovering, setIsHovering] = useState<boolean>(false);

    function getLabelByLabelId(labelId: number) {
        return kanbanState.labels[labelId];
    }

    function openCard() {
        navigate(`/projects/${projectId}/board/${boardId}/card/${props.card.cardId}`);
    }

    function label(labelId: number) {

        const label: Label = getLabelByLabelId(labelId);
        const color: Rgb = toRgb(label.labelColor);

        return (
            <div key={labelId} style={{ backgroundColor: `rgb(${color.red},${color.green},${color.blue})` }} className="card-label">
                <p>{label.labelText}</p>
            </div>
        )
    }

    async function onStateChange(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation();
        if (!dispatch) return;

        const newState: boolean = !kanbanState.cards[props.card.cardId].isDone;
        dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: props.card.cardId, newState: newState } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: props.card.cardId, newState: !newState } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/card/${props.card.cardId}/done/${newState}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch card state");
                }
            })
            .catch(err => {
                dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: props.card.cardId, newState: !newState } });
                console.error(err);
            })
    }

    function getTotalTasks(checklists: ChecklistGetDto[]) {
        let totalTasks = 0;
        for (const checklist of checklists) {
            totalTasks += checklist.checklistItems.length;
        }
        return totalTasks;
    }

    function getTotalTasksCompleted(checklists: ChecklistGetDto[]) {
        let totalCompletedTasks = 0;
        for (const checklist of checklists) {
            for (const checklistItem of checklist.checklistItems) {
                if (checklistItem.isDone) {
                    totalCompletedTasks++;
                }
            }
        }
        return totalCompletedTasks;
    }

    return (
        <div onClick={openCard} className="card" onPointerEnter={() => setIsHovering(true)} onPointerLeave={() => setIsHovering(false)}>
            { props.card.labelIds.length > 0 && (
                <div className="card-labels-div">
                    { props.card.labelIds.map((labelId: number) => {
                        return label(labelId);
                    })}
                </div>
            ) }
            <div style={{ display: "flex", alignItems: "center" }}>
                <div onClick={onStateChange}
                     className={`card-checkmark ${ (props.card.isDone || isHovering) ? "visible" : "hidden" }`}>{ props.card.isDone ? "✓" : "" }</div>
                <p>{props.card.cardName}</p>
            </div>
            { (props.card.checklists !== undefined && props.card.checklists.length > 0) && (
                <div className="card-checklist-hint">
                    <p>✓ {getTotalTasksCompleted(props.card.checklists)} / {getTotalTasks(props.card.checklists)}</p>
                </div>
            ) }

        </div>
    )

}

export default CardComp;