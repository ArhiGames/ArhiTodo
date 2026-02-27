import {useParams} from "react-router-dom";
import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import type {Card} from "../../../Models/States/KanbanState.ts";
import CardUrgencyLabel from "../CardUrgencyLabel.tsx";
import {useRef, useState} from "react";
import Popover from "../../../lib/Popover/Popover.tsx";
import {API_BASE_URL} from "../../../config/api.ts";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";

const ViewCardUrgencyComp = () => {

    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { boardId, cardId } = useParams();
    const { checkRefresh } = useAuth();

    const urgencyLabelRef = useRef<HTMLDivElement>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    async function updateCardUrgency(newUrgencyLevel: number) {

        const card: Card | undefined = kanbanState.cards.get(Number(cardId));
        if (!card) return;

        const oldUrgencyLevel: number = card.cardUrgencyLevel;

        if (dispatch) {
            dispatch({
                type: "UPDATE_CARD_URGENCY", payload: { cardId: Number(cardId), newUrgencyLevel: newUrgencyLevel }
            })
        }

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({
                    type: "UPDATE_CARD_URGENCY", payload: { cardId: Number(cardId), newUrgencyLevel: oldUrgencyLevel }
                })
            }
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${cardId}/urgency/${newUrgencyLevel}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not update card urgency!");
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({
                        type: "UPDATE_CARD_URGENCY", payload: { cardId: Number(cardId), newUrgencyLevel: oldUrgencyLevel }
                    })
                }
                console.error(err);
            })

        setIsEditing(false);
    }

    const card: Card | undefined = kanbanState.cards.get(Number(cardId));
    if (!card) return null;

    return (
        <>
            <CardUrgencyLabel ref={urgencyLabelRef} onClick={() => setIsEditing(true)} cardUrgencyLevel={card.cardUrgencyLevel}/>
            { isEditing && (
                <Popover close={() => setIsEditing(false)} element={urgencyLabelRef} closeIfClickedOutside>
                    <div className="urgencies-popover">
                        {[0, 1, 2, 3, 4].map((urgencyLevel: number) => {
                            return <CardUrgencyLabel key={urgencyLevel} cardUrgencyLevel={urgencyLevel}
                                                     onClick={() => updateCardUrgency(urgencyLevel)}/>
                        })}
                    </div>
                </Popover>
            ) }
        </>
    )

}

export default ViewCardUrgencyComp;