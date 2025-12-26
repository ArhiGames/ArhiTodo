import type { Label } from "../../../Models/States/types.ts";
import "./EditableLabel.css"
import { type Rgb, toRgb } from "../../Functions.ts";

interface Props {
    label: Label
    onEditPressed: (label: Label) => void;
}

const EditableLabel = ( { label, onEditPressed }: Props) => {

    const color: Rgb = toRgb(label.labelColor);

    return (
        <div className="editable-label-div">
            <button style={{ backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})` }} className="label">{label.labelText}</button>
            <img height="24x" onClick={() => onEditPressed(label)} src="../../../../public/edit-icon.svg" alt="Edit"/>
        </div>
    )

}

export default EditableLabel;