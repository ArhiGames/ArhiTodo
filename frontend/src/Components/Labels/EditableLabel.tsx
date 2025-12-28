import type { Label } from "../../Models/States/types.ts";
import "./EditableLabel.css"
import { type Rgb, toRgb } from "../../lib/Functions.ts";

interface Props {
    label: Label;
    onSelected: (label: Label) => void;
    onEditPressed: (label: Label) => void;
}

const EditableLabel = ( { label, onEditPressed }: Props) => {

    const color: Rgb = toRgb(label.labelColor);

    function onButtonEditPressed(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.stopPropagation();
        onEditPressed(label);
    }

    return (
        <div className="editable-label-div">
            <button style={{ backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})` }} className="label">{label.labelText}</button>
            <img className="edit-label-icon" height="24x" onClick={onButtonEditPressed} src="../../private/edit-icon.svg" alt="Edit"/>
        </div>
    )

}

export default EditableLabel;