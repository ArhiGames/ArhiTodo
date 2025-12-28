import type { CardGetDto } from "../../Models/BackendDtos/GetDtos/CardGetDto.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import type {Label, State} from "../../Models/States/types.ts";
import {type Rgb, toRgb} from "../../lib/Functions.ts";

const CardComp = (props: { card: CardGetDto }) => {

    const navigate = useNavigate();
    const kanbanState: State = useKanbanState();
    const { projectId, boardId } = useParams();

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

    return (
        <div onClick={openCard} className="card">
            { props.card.labels.length > 0 && (
                <div className="card-labels-div">
                    { props.card.labels.map(({ labelId }) => {
                        return label(labelId);
                    })}
                </div>
            ) }
            <p>{props.card.cardName}</p>
        </div>
    )

}

export default CardComp;