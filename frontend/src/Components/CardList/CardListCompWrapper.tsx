import {useDraggable, useDroppable} from "@dnd-kit/react";
import {CollisionPriority} from "@dnd-kit/abstract";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import CardListComp from "./CardListComp.tsx";
import {useCallback} from "react";

interface Props {
    cardListId: number;
    dndIndex: number;
}

const CardListCompWrapper = (props: Props) => {

    const permissions = usePermissions();

    const { ref: draggableRef, handleRef: draggableHandleRef } = useDraggable({
        id: `cardList-${props.cardListId}`,
        type: "cardlist",
        disabled: !permissions.hasManageCardListsPermission(),
        data: {
            index: props.dndIndex
        }
    });
    const { ref: droppableRef } = useDroppable({
        id: `cardListDroppable-${props.cardListId}`,
        type: "cardlist",
        disabled: !permissions.hasManageCardListsPermission(),
        collisionPriority: CollisionPriority.Lowest,
        data: {
            index: props.dndIndex
        }
    });

    const setRef = useCallback((ref: HTMLDivElement | null) => {
        draggableRef(ref);
        droppableRef(ref);
    }, [draggableRef, droppableRef])

    return (
        <div ref={setRef} className="cardlist-wrapper">
            <CardListComp cardListId={props.cardListId} draggableHandleRef={draggableHandleRef}/>
        </div>
    )

}

export default CardListCompWrapper;