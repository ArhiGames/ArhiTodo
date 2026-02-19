import {useDroppable} from "@dnd-kit/react";

interface Props {
    type: string;
    id: string;
    height: string;
    dndIndex: number;
}

const DroppableArea = (props: Props) => {

    const { ref } = useDroppable({
        id: props.id,
        type: props.type,
        data: {
            index: props.dndIndex,
        }
    });

    return (
        <div ref={ref} style={{ width: "100%", minHeight: props.height }}>{props.dndIndex}</div>
    )

}

export default DroppableArea;