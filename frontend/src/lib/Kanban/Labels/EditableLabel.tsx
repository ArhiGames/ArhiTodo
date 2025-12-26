import type { Label } from "../../../Models/States/types.ts";
import "./EditableLabel.css"

interface Props {
    label: Label
    onEditPressed: (label: Label) => void;
}

const EditableLabel = ( { label, onEditPressed }: Props) => {

    return (
        <div className="editable-label-div">
            <button className="button standard-button">{label.labelText}</button>
            <img height="24x" onClick={() => onEditPressed(label)} src="../../../../public/edit-icon.svg" alt="Edit"/>
        </div>
    )

}

export default EditableLabel;