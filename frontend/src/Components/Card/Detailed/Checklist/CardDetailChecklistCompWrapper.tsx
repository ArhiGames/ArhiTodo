import CardDetailChecklistComp from "./CardDetailChecklistComp.tsx";
import {useDraggable, useDroppable} from "@dnd-kit/react";
import {RestrictToVerticalAxis} from "@dnd-kit/abstract/modifiers";
import {CollisionPriority} from "@dnd-kit/abstract";
import {usePermissions} from "../../../../Contexts/Authorization/usePermissions.ts";
import {type RefObject, useCallback} from "react";
import {RestrictToElement} from "@dnd-kit/dom/modifiers";

interface Props {
    dndIndex: number;
    checklistId: number;
    containerElement: RefObject<HTMLElement | null>;
}

const CardDetailChecklistCompWrapper = (props: Props) => {

    const permissions = usePermissions();

    const { ref: draggableRef } = useDraggable({
        id: `checklist-${props.checklistId}`,
        type: "checklist",
        disabled: !permissions.hasManageCardsPermission(),
        modifiers: [RestrictToVerticalAxis, RestrictToElement.configure({ element: props.containerElement.current })],
        data: {
            index: props.dndIndex
        }
    });
    const { ref: droppableRef } = useDroppable({
        id: `checklistDroppable-${props.checklistId}`,
        type: "checklist",
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
        <div ref={setRef} className="card-detail-checklist-wrapper">
            <CardDetailChecklistComp checklistId={props.checklistId} containerElement={props.containerElement}/>
        </div>
    )

}

export default CardDetailChecklistCompWrapper;