import {usePermissions} from "../../../../../Contexts/Authorization/usePermissions.ts";
import {useDraggable, useDroppable} from "@dnd-kit/react";
import {CollisionPriority} from "@dnd-kit/abstract";
import {useCallback} from "react";
import CardDetailChecklistItemComp from "./CardDetailChecklistItemComp.tsx";

interface Props {
    dndIndex: number;
    checklistId: number;
    checklistItemId: number;
}

const CardDetailChecklistItemCompWrapper = (props: Props) => {

    const permissions = usePermissions();

    const { ref: draggableRef } = useDraggable({
        id: `checklistItem-${props.checklistItemId}`,
        type: "checklistitem",
        disabled: !permissions.hasManageCardsPermission(),
        data: {
            index: props.dndIndex
        }
    });
    const { ref: droppableRef } = useDroppable({
        id: `checklistItemDroppable-${props.checklistItemId}`,
        type: "checklistitem",
        accept: "checklistitem",
        disabled: !permissions.hasManageCardsPermission(),
        collisionPriority: CollisionPriority.Highest,
        data: {
            index: props.dndIndex
        }
    });

    const setRef = useCallback((ref: HTMLDivElement | null) => {
        draggableRef(ref);
        droppableRef(ref);
    }, [draggableRef, droppableRef])

    return (
        <div ref={setRef} className="card-detail-checklist-item-wrapper">
            <CardDetailChecklistItemComp checklistId={props.checklistId} checklistItemId={props.checklistItemId}/>
        </div>
    )

}

export default CardDetailChecklistItemCompWrapper;