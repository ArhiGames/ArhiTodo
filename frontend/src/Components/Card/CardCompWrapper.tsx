import {useDraggable, useDroppable} from "@dnd-kit/react";
import CardComp from "./CardComp.tsx";

import {CollisionPriority} from "@dnd-kit/abstract";

interface Props {
    cardId: number;
    dndIndex: number;
}

const CardCompWrapper = (props: Props) => {

    const { ref: draggableRef } = useDraggable({
        id: `card-${props.cardId}`,
        type: "card",
        data: {
            index: props.dndIndex
        }
    });
    const { ref: droppableRef } = useDroppable({
        id: `cardDroppable-${props.cardId}`,
        type: "card",
        collisionPriority: CollisionPriority.Highest,
        data: {
            index: props.dndIndex
        }
    })

    const setDroppableRefs = (ref: HTMLDivElement) => {
        draggableRef(ref);
        droppableRef(ref);
    }

    return (
        <div ref={setDroppableRefs} className="card-wrapper">
            <CardComp cardId={props.cardId}/>
        </div>
    )

}

export default CardCompWrapper;