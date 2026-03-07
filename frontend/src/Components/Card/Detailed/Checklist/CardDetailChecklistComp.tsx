import "./CardDetailChecklistsComp.css"
import {useKanbanState} from "../../../../Contexts/Kanban/Hooks.ts";
import CardDetailChecklistHeaderComp from "./CardDetailChecklistHeaderComp.tsx";
import {usePermissions} from "../../../../Contexts/Authorization/usePermissions.ts";
import CardDetailChecklistItemCompWrapper from "./ChecklistItem/CardDetailChecklistItemCompWrapper.tsx";
import CardDetailAddChecklistItemComp from "./CardDetailAddChecklistItemComp.tsx";
import type {Checklist, ChecklistItem} from "../../../../Models/States/KanbanState.ts";

interface Props {
    checklistId: number;
}

const CardDetailChecklistComp = (props: Props) => {

    const kanbanState = useKanbanState();
    const permissions = usePermissions();

    const checklist: Checklist | undefined = kanbanState.checklists.get(props.checklistId);

    function getTotalTasks(): number {
        return checklist?.checklistItemIds.length ?? 0;
    }

    function getCompletedTasks() {
        let completedTasks = 0;
        for (const checklistItemId of checklist?.checklistItemIds ?? []) {
            const checklistItem: ChecklistItem | undefined = kanbanState.checklistItems.get(checklistItemId);
            if (checklistItem && checklistItem.isDone) {
                completedTasks++;
            }
        }
        return completedTasks;
    }

    function getCompletedTasksPercentage() {
        const totalTasks = getTotalTasks();
        const completedTasks = getCompletedTasks();
        return completedTasks / totalTasks;
    }



    return (
        <div className="card-detail-checklist">
            <CardDetailChecklistHeaderComp checklistId={props.checklistId}/>
            <div className="card-detail-progress-container">
                <p>{checklist && checklist?.checklistItemIds.length > 0 ? Math.floor(getCompletedTasksPercentage() * 100) : 0}%</p>
                <div className="card-detail-progress-bg">
                    <div className="card-detail-progress-fg" style={{ width: `${getCompletedTasksPercentage() * 100}%` }}/>
                </div>
            </div>
            <div className="card-detail-checklist-items">
                {kanbanState.checklists.get(props.checklistId)?.checklistItemIds.map((checklistItemId: number, index: number) => {
                    return <CardDetailChecklistItemCompWrapper key={checklistItemId} dndIndex={index}
                                                               checklistItemId={checklistItemId} checklistId={props.checklistId}/>
                })}
            </div>
            { permissions.hasManageCardsPermission() && (
                <CardDetailAddChecklistItemComp checklistId={props.checklistId}/>
            )}
        </div>
    )

}

export default CardDetailChecklistComp;