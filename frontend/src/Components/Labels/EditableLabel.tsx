import type { Label } from "../../Models/States/KanbanState.ts";
import "./EditableLabel.css"
import {getRgbContrastTextColor, type Rgb, toRgb} from "../../lib/Functions.ts";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";

interface Props {
    labelId: number;
    isSelected: boolean;
    onLabelSelected: (labelId: number) => void;
    onLabelUnselected: (labelId: number) => void;
    onEditPressed: (labelId: number) => void;
    selectable: boolean;
}

const EditableLabel = (props: Props) => {

    const permissions = usePermissions();
    const kanbanState = useKanbanState();

    const label: Label | undefined = kanbanState.labels.get(props.labelId);
    const color: Rgb = toRgb(label?.labelColor ?? 0);

    function onButtonEditPressed(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.stopPropagation();
        props.onEditPressed(label?.labelId ?? -1);
    }

    function onEditableLabelDivPressed() {
        if (!props.selectable) return;

        if (props.isSelected) {
            props.onLabelUnselected(label?.labelId ?? -1);
        } else {
            props.onLabelSelected(label?.labelId ?? -1);
        }
    }

    return (
        <div className="editable-label-div" onClick={onEditableLabelDivPressed}>
            <div style={{ position: "relative", width: "100%" }}>
                <div style={{ backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})`,
                    color: getRgbContrastTextColor(label?.labelColor ?? 0) }} className="label">{label?.labelText ?? ""}</div>
                { props.isSelected && <span style={{ position: "absolute", right: 6, top: 9 }}>✔</span> }
            </div>
            { permissions.hasManageLabelsPermission() && <img className="edit-label-icon icon clickable" height="24x" onClick={onButtonEditPressed} src="/edit-icon.svg" alt="Edit"/> }
        </div>
    )

}

export default EditableLabel;