import BoardHeader from "./BoardHeader.tsx";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import {useDraggable, useDroppable} from "@dnd-kit/react";
import {CollisionPriority} from "@dnd-kit/abstract";
import {useCallback} from "react";
import {RestrictToHorizontalAxis} from '@dnd-kit/abstract/modifiers';

interface Props {
    boardId: number;
    dndIndex: number;
}

const BoardHeaderWrapper = (props: Props) => {

    const permissions = usePermissions();

    const { ref: draggableRef } = useDraggable({
        id: `board-${props.boardId}`,
        type: "board",
        modifiers: [RestrictToHorizontalAxis],
        disabled: !permissions.hasEditBoardPermission(),
        data: {
            index: props.dndIndex
        }
    });
    const { ref: droppableRef } = useDroppable({
        id: `boardDroppable-${props.boardId}`,
        type: "board",
        disabled: !permissions.hasEditBoardPermission(),
        collisionPriority: CollisionPriority.Low,
        data: {
            index: props.dndIndex
        }
    })

    const setRefs = useCallback((ref: HTMLDivElement | null) => {
        draggableRef(ref);
        droppableRef(ref);
    }, [draggableRef, droppableRef])

    return (
        <div ref={setRefs} className="board-header-wrapper">
            <BoardHeader boardId={props.boardId}/>
        </div>
    )

}

export default BoardHeaderWrapper;