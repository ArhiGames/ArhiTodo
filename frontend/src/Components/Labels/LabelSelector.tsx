import Popover from "../../lib/Popover/Popover.tsx";
import {type RefObject, useEffect, useState} from "react";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type { Label } from "../../Models/States/types.ts";
import "./LabelSelector.css"
import EditableLabel from "./EditableLabel.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {Claim} from "../../Models/Claim.ts";
import LabelEditor from "./LabelEditor.tsx";

interface Props {
    element: RefObject<HTMLElement | null>,
    onClose: () => void;
    onLabelSelected: (labelId: number) => void;
    onLabelUnselected: (labelId: number) => void;
    selectedLabels: number[];
    actionTitle: string;
    projectId: number;
    boardId: number;
}

const LabelSelector = ( props: Props ) => {

    const { jwtPayload } = useAuth();
    const kanbanState = useKanbanState();

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [currentlyEditingLabelId, setCurrentlyEditingLabelId] = useState<number | null>(null);

    function cancelAction() {
        setIsCreating(false);
        setCurrentlyEditingLabelId(null);
    }

    useEffect(() => {
        if (!currentlyEditingLabelId) return;
        if (!kanbanState.labels[currentlyEditingLabelId]) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            cancelAction();
        }
    }, [currentlyEditingLabelId, kanbanState.labels]);

    function onLabelEdit(labelId: number) {
        setCurrentlyEditingLabelId(labelId);
    }

    function mayEditLabel() {
        const hasPermissionGlobally = jwtPayload?.ModifyOthersProjects === "true";
        const hasBoardPermission = kanbanState.boardUserClaims[props.boardId]
            ?.some((buc: Claim) => buc.claimType === "ManageLabels" && buc.claimValue === "true");
        return hasPermissionGlobally || hasBoardPermission;
    }

    return (
        <Popover close={props.onClose} element={props.element}>
            <div className="label-selector-popover">
                <p>{ isCreating ? "Creating label" : currentlyEditingLabelId !== null ? "Editing label" : props.actionTitle }</p>
                {
                    (isCreating || currentlyEditingLabelId !== null) ? (
                        <LabelEditor boardId={props.boardId} currentlyEditingLabelId={currentlyEditingLabelId} setCurrentlyEditingLabelId={setCurrentlyEditingLabelId}
                                     isCreating={isCreating} setIsCreating={setIsCreating} cancelAction={cancelAction}/>
                    ) : (
                        <>
                            <div className="label-selector-existing scroller">
                                {
                                    Object.values(kanbanState.labels).map((label: Label) => {
                                        return ( label.boardId == props.boardId && (
                                            <EditableLabel key={label.labelId} label={label} onEditPressed={onLabelEdit}
                                                           isSelected={ props.selectedLabels.includes(label.labelId) }
                                                           onLabelSelected={(labelId: number) => props.onLabelSelected(labelId)}
                                                           onLabelUnselected={(labelId: number) => props.onLabelUnselected(labelId)}/>
                                        ) )
                                    })
                                }
                            </div>
                            { mayEditLabel() && <button
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