import {usePermissions} from "../../../../../Contexts/Authorization/usePermissions.ts";
import {useDraggable, useDroppable} from "@dnd-kit/react";
import {CollisionPriority} from "@dnd-kit/abstract";
import {type RefObject, useCallback} from "react";
import CardDetailChecklistItemComp from "./CardDetailChecklistItemComp.tsx";
import {RestrictToVerticalAxis} from "@dnd-kit/abstract/modifiers";
import {RestrictToElement} from "@dnd-kit/dom/modifiers";

interface Props {
    dndIndex: number;
    checklistId: number;
    checklistItemId: number;
    containerElement: RefObject<HTMLElement | null>;
}

const CardDetailChecklistItemCompWrapper = (props: Props) => {

    const permissions = usePermissions();

    const { ref: draggableRef } = useDraggable({
        id: `checklistItem-${props.checklistItemId}`,
        type: "checklistitem",
        disabled: !permissions.hasManageCardsPermission(),
        modifiers: [RestrictToVerticalAxis, RestrictToElement.configure({ element: props.containerElement.current })],
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