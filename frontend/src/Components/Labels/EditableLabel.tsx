import type { Label } from "../../Models/States/KanbanState.ts";
import "./EditableLabel.css"
import { type Rgb, toRgb } from "../../lib/Functions.ts";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";

interface Props {
    label: Label;
    isSelected: boolean;
    onLabelSelected: (labelId: number) => void;
    onLabelUnselected: (labelId: number) => void;
    onEditPressed: (labelId: number) => void;
    selectable: boolean;
}

const EditableLabel = ( props: Props ) => {

    const permissions = usePermissions();

    const color: Rgb = toRgb(props.label.labelColor);

    function onButtonEditPressed(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.stopPropagation();
        props.onEditPressed(props.label.labelId);
    }

    function onEditableLabelDivPressed() {
        if (!props.selectable) return;

        if (props.isSelected) {
            props.onLabelUnselected(props.label.labelId);
        } else {
            props.onLabelSelected(props.label.labelId);
        }
    }

    return (
        <div className="editable-label-div" onClick={onEditableLabelDivPressed}>
            <div style={{ position: "relative", width: "100%" }}>
                <button style={{ backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})` }} className="label">{props.label.labelText}</button>
                { props.isSelected && <span style={{ position: "absolute", right: 6, top: 9 }}>✓</span> }
            </div>
            { permissions.hasManageLabelsPermission() && <img className="edit-label-icon" height="24x" onClick={onButtonEditPressed} src="/edit-icon.svg" alt="Edit"/> }
        </div>
    )

}

export default EditableLabel;