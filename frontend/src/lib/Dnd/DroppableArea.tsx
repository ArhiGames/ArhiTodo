import {useDroppable} from "@dnd-kit/react";

interface Props {
    type: string;
    id: string;
    height: string;
}

const DroppableArea = (props: Props) => {

    const { ref } = useDroppable({
        id: props.id,
        type: props.type,
    });

    return (
        <div ref={ref} style={{ width: "100%", minHeight: props.height }}/>
    )

}

export default DroppableArea;