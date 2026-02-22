import LabelSelector from "../../Labels/LabelSelector.tsx";
import {type Rgb, toRgb} from "../../../lib/Functions.ts";
import type {Label} from "../../../Models/States/KanbanState.ts";
import {useParams} from "react-router-dom";
import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import {API_BASE_URL} from "../../../config/api.ts";
import {useRef, useState} from "react";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";

const ViewCardLabelsComp = () => {

    const { boardId, cardId } = useParams();
    const { checkRefresh } = useAuth();
    const permissions = usePermissions();
    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();

    const currentEditLabelRef = useRef<HTMLElement>(null);
    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);

    function getPureLabelIds() {
        const labelIds: number[] = [];
        for (const labelId of kanbanState.cardLabels.get(Number(cardId))!) {
            labelIds.push(labelId);
        }
        return labelIds;
    }

    async function onLabelSelected(labelId: number) {
        if (!dispatch || !cardId) return;

        dispatch({ type: "ADD_LABEL_TO_CARD_OPTIMISTIC", payload: { cardId: Number(cardId), labelId: labelId } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "REMOVE_LABEL_FROM_CARD", payload: { cardId: Number(cardId), labelId: labelId } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${Number(cardId)}/label/${labelId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to add card label");
                }
            })
            .catch(err => {
                dispatch({ type: "REMOVE_LABEL_FROM_CARD", payload: { cardId: Number(cardId), labelId: labelId } });
                console.error(err);
            })
    }

    async function onLabelUnselected(labelId: number) {
        if (!dispatch || !cardId) return;

        dispatch({ type: "REMOVE_LABEL_FROM_CARD", payload: { cardId: Number(cardId), labelId: labelId } });

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            dispatch({ type: "ADD_LABEL_TO_CARD_OPTIMISTIC", payload: { cardId: Number(cardId), labelId: labelId } });
            return;
        }

        fetch(`${API_BASE_URL}/board/${boardId}/card/${Number(cardId)}/label/${labelId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete card label");
                }
            })
            .catch(err => {
                dispatch({ type: "ADD_LABEL_TO_CARD_OPTIMISTIC", payload: { cardId: Number(cardId), labelId: labelId } });
                console.error(err);
            })
    }

    function onLabelSelectedClicked(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        currentEditLabelRef.current = e.currentTarget;
        setIsEditingLabels(!isEditingLabels);
    }

    return (
        <div className="card-details-labels">
            {
                kanbanState.cardLabels.has(Number(cardId)) && (
                    kanbanState.cardLabels.get(Number(cardId))?.map((labelId: number) => {
                        const label: Label | undefined = kanbanState.labels.get(labelId);
                        if (!label) return null;
                        const color: Rgb = toRgb(label.labelColor);
                        return (
                            <div style={{ backgroundColor: `rgb(${color.red},${color.green},${color.blue})` }}
                                 key={label.labelId} className="detailed-card-label"
                                 onClick={onLabelSelectedClicked}>
                                {label.labelText}
                            </div>
                        )
                    }))
            }
            { permissions.hasManageCardsPermission() && <button onClick={onLabelSelectedClicked}
                                                                className="button standard-button">+</button> }
            {
                isEditingLabels && <LabelSelector element={currentEditLabelRef}
                                                  actionTitle="Edit card labels"
                                                  onClose={() => setIsEditingLabels(false)}
                                                  onLabelSelected={onLabelSelected}
                                                  onLabelUnselected={onLabelUnselected}
                                                  selectedLabels={getPureLabelIds()}
                                                  selectable={permissions.hasManageCardsPermission()}/>
            }
        </div>
    )
}

export default ViewCardLabelsComp;