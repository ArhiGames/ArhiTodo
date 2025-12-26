import Popover from "../../Popover/Popover.tsx";
import { type RefObject } from "react";
import { useKanbanState } from "../../../Contexts/Kanban/Hooks.ts";
import type { Label } from "../../../Models/States/types.ts";
import "./LabelSelector.css"
import EditableLabel from "./EditableLabel.tsx";

interface Props {
    element: RefObject<HTMLElement | null>,
    onClose: () => void;
    boardId: number;
    actionTitle: string;
}

const LabelSelector = ({ element, onClose, boardId, actionTitle }: Props) => {

    const kanbanState = useKanbanState();

    function onLabelEdit(label: Label) {
        console.log("onLabelEdit", label);
    }

    return (
        <Popover close={onClose} element={element}>
            <div className="label-selector-popover">
                <p>{actionTitle}</p>
                <div className="label-selector-existing">
                    {
                        Object.values(kanbanState.labels).map((label: Label) => {
                            if (label.boardId == boardId) {
                                return (<EditableLabel key={label.labelId} label={label} onEditPressed={onLabelEdit}/>)
                            } else {
                                return null
                            }
                        })
                    }
                </div>
                <button className="button standard-button create-label-button">Create label</button>
            </div>
        </Popover>
    )

}

export default LabelSelector;