import Popover from "../../lib/Popover/Popover.tsx";
import {type RefObject, useEffect, useRef, useState} from "react";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import "./LabelSelector.css"
import LabelEditor from "./LabelEditor.tsx";
import {useParams} from "react-router-dom";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import EditableLabelWrapper from "./EditableLabelWrapper.tsx";

interface Props {
    element: RefObject<HTMLElement | null>,
    onClose: () => void;
    onLabelSelected: (labelId: number) => void;
    onLabelUnselected: (labelId: number) => void;
    selectedLabels: number[];
    actionTitle: string;
    selectable: boolean;
}

const LabelSelector = ( props: Props ) => {

    const kanbanState = useKanbanState();
    const { boardId } = useParams();
    const permissions = usePermissions();

    const labelsContainerElem: React.RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
    const [isDraggingEditableLabel, setDraggingEditableLabel] = useState<boolean>(false);

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [currentlyEditingLabelId, setCurrentlyEditingLabelId] = useState<number | null>(null);

    function cancelAction() {
        setIsCreating(false);
        setCurrentlyEditingLabelId(null);
    }

    useEffect(() => {
        if (!currentlyEditingLabelId) return;
        if (!kanbanState.labels.has(currentlyEditingLabelId)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            cancelAction();
        }
    }, [currentlyEditingLabelId, kanbanState.labels]);

    function onLabelEdit(labelId: number) {
        setCurrentlyEditingLabelId(labelId);
    }

    return (
        <Popover close={props.onClose} element={props.element} triggerElement={props.element} keepOpenIfClickedOutside={isDraggingEditableLabel}>
            <div className="label-selector-popover">
                <p>{ isCreating ? "Creating label" : currentlyEditingLabelId !== null ? "Editing label" : props.actionTitle }</p>
                {
                    (isCreating || currentlyEditingLabelId !== null) ? (
                        <LabelEditor currentlyEditingLabelId={currentlyEditingLabelId} setCurrentlyEditingLabelId={setCurrentlyEditingLabelId}
                                     isCreating={isCreating} setIsCreating={setIsCreating} cancelAction={cancelAction}/>
                    ) : (
                        <>
                            <div ref={labelsContainerElem} className="label-selector-existing scroller">
                                {
                                    kanbanState.boards.get(Number(boardId))?.labelIds.map((labelId: number, index: number) => {
                                        return (
                                            <EditableLabelWrapper key={labelId} onEditPressed={onLabelEdit} labelId={labelId}
                                                                  setIsDraggingEditableLabel={setDraggingEditableLabel}
                                                                  dndIndex={index} containerElem={labelsContainerElem}
                                                                  isSelected={props.selectedLabels.includes(labelId)}
                                                                  onLabelSelected={props.onLabelSelected} selectable={props.selectable}
                                                                  onLabelUnselected={props.onLabelUnselected}/>
                                        )
                                    })
                                }
                            </div>
                            { permissions.hasManageLabelsPermission() && <button
                                onClick={() => setIsCreating(true)}
                                className="button standard-button create-label-button">Create label</button> }
                        </>
                    )
                }

            </div>
        </Popover>
    )

}

export default LabelSelector;