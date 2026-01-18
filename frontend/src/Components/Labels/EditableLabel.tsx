import type { Label } from "../../Models/States/types.ts";
import "./EditableLabel.css"
import { type Rgb, toRgb } from "../../lib/Functions.ts";

interface Props {
    label: Label;
    isSelected: boolean;
    onLabelSelected: (label: Label) => void;
    onLabelUnselected: (label: Label) => void;
    onEditPressed: (label: Label) => void;
}

const EditableLabel = ( props: Props) => {

    const color: Rgb = toRgb(props.label.labelColor);

    function onButtonEditPressed(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.stopPropagation();
        props.onEditPressed(props.label);
    }

    function onEditableLabelDivPressed() {
        if (props.isSelected) {
            props.onLabelUnselected(props.label);
        } else {
            props.onLabelSelected(props.label);
        }
    }

    return (
        <div className="editable-label-div" onClick={onEditableLabelDivPressed}>
            <div style={{ position: "relative", width: "100%" }}>
                <button style={{ backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})` }} className="label">{props.label.labelText}</button>
                { props.isSelected && <span style={{ position: "absolute", right: 6, top: 9 }}>✓</span> }
            </div>
            <img className="edit-label-icon" height="24x" onClick={onButtonEditPressed} src="/edit-icon.svg" alt="Edit"/>
        </div>
    )

}

export default EditableLabel;