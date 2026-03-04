import EditableLabel from "./EditableLabel.tsx";
import {useDraggable, useDroppable} from "@dnd-kit/react";
import {RestrictToVerticalAxis} from "@dnd-kit/abstract/modifiers";
import {RestrictToElement} from "@dnd-kit/dom/modifiers";
import {CollisionPriority} from "@dnd-kit/abstract";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import {type Dispatch, type SetStateAction, useCallback, useEffect} from "react";

interface Props {
    dndIndex: number;
    containerElem: React.RefObject<HTMLDivElement | null>;
    setIsDraggingEditableLabel: Dispatch<SetStateAction<boolean>>;
    labelId: number;
    isSelected: boolean;
    onLabelSelected: (labelId: number) => void;
    onLabelUnselected: (labelId: number) => void;
    onEditPressed: (labelId: number) => void;
    selectable: boolean;
}

const EditableLabelWrapper = (props: Props) => {

    const permissions = usePermissions();

    const { ref: draggableRef, isDragging } = useDraggable({
        id: `label-${props.labelId}`,
        type: "label",
        modifiers: [RestrictToVerticalAxis, RestrictToElement.configure({ element: props.containerElem.current })],
        disabled: !permissions.hasManageLabelsPermission(),
        data: {
            index: props.dndIndex
        }
    });
    const { ref: droppableRef } = useDroppable({
        id: `labelDroppable-${props.labelId}`,
        type: "label",
        disabled: !permissions.hasManageLabelsPermission(),
        collisionPriority: CollisionPriority.Highest,
        data: {
            index: props.dndIndex
        }
    });

    useEffect(() => {
        props.setIsDraggingEditableLabel(isDragging);
    }, [isDragging]);

    const setRef = useCallback((ref: HTMLDivElement | null) => {
        draggableRef(ref);
        droppableRef(ref);
    }, [draggableRef, droppableRef]);

    return (
        <div ref={setRef} className="editable-label-div-wrapper">
            <EditableLabel labelId={props.labelId} onEditPressed={props.onEditPressed}
                           isSelected={props.isSelected}
                           onLabelSelected={props.onLabelSelected}
                           onLabelUnselected={props.onLabelUnselected}
                           selectable={props.selectable}/>
        </div>
    )

}

export default EditableLabelWrapper;