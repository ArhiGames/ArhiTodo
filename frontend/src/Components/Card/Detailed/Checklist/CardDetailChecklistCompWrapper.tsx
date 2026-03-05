import CardDetailChecklistComp from "./CardDetailChecklistComp.tsx";
import {useDraggable, useDroppable} from "@dnd-kit/react";
import {CollisionPriority} from "@dnd-kit/abstract";
import {usePermissions} from "../../../../Contexts/Authorization/usePermissions.ts";
import {useCallback} from "react";

interface Props {
    dndIndex: number;
    checklistId: number;
}

const CardDetailChecklistCompWrapper = (props: Props) => {

    const permissions = usePermissions();

    const { ref: draggableRef } = useDraggable({
        id: `checklist-${props.checklistId}`,
        type: "checklist",
        disabled: !permissions.hasManageCardsPermission(),
        data: {
            index: props.dndIndex
        }
    });
    const { ref: droppableRef } = useDroppable({
        id: `checklistDroppable-${props.checklistId}`,
        type: "checklist",
        disabled: !permissions.hasManageCardsPermission(),
        collisionPriority: CollisionPriority.Low,
        data: {
            index: props.dndIndex
        }
    });

    const setRef = useCallback((ref: HTMLDivElement | null) => {
        draggableRef(ref);
        droppableRef(ref);
    }, [draggableRef, droppableRef])

    return (
        <div ref={setRef} className="card-detail-checklist-wrapper">
            <CardDetailChecklistComp checklistId={props.checklistId}/>
        </div>
    )

}

export default CardDetailChecklistCompWrapper;