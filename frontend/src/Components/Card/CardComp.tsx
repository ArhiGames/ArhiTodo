import type { CardGetDto } from "../../Models/BackendDtos/GetDtos/CardGetDto.ts";
import { useNavigate, useParams } from "react-router-dom";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type { Label, State } from "../../Models/States/types.ts";
import { type Rgb, toRgb } from "../../lib/Functions.ts";
import {useState} from "react";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../config/api.ts";

const CardComp = (props: { card: CardGetDto }) => {

    const navigate = useNavigate();
    const kanbanState: State = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { token } = useAuth();
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

    function onStateChange(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.stopPropagation();
        if (!dispatch) return;

        const newState: boolean = !kanbanState.cards[props.card.cardId].isDone;
        dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: props.card.cardId, newState: newState } });

        fetch(`${API_BASE_URL}/card/${props.card.cardId}/done/${newState}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
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

    return (
        <div onClick={openCard} className="card" onPointerEnter={() => setIsHovering(true)} onPointerLeave={() => setIsHovering(false)}>
            { props.card.labels.length > 0 && (
                <div className="card-labels-div">
                    { props.card.labels.map(({ labelId }) => {
                        return label(labelId);
                    })}
                </div>
            ) }
            <div style={{ display: "flex", alignItems: "center" }}>
                <div onClick={onStateChange}
                     className={`card-checkmark ${ (props.card.isDone || isHovering) ? "visible" : "hidden" }`}>{ props.card.isDone ? "✓" : "" }</div>
                <p>{props.card.cardName}</p>
            </div>
        </div>
    )

}

export default CardComp;