import LabelSelector from "../Labels/LabelSelector.tsx";
import type {Label} from "../../Models/States/KanbanState.ts";
import {type Rgb, toRgb} from "../../lib/Functions.ts";
import {type Dispatch, type SetStateAction, useRef, useState} from "react";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import BoardUserSelector from "./UserSelector/BoardUserSelector.tsx";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";

interface Props {
    currentFilteringLabels: number[];
    setCurrentFilteringLabels: Dispatch<SetStateAction<number[]>>;
}

const BoardCompHeader = (props: Props) => {

    const kanbanState = useKanbanState();
    const permissions = usePermissions();

    const seeLabelsButtonRef = useRef<HTMLElement | null>(null);
    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);

    const boardMembersButtonRef = useRef<HTMLImageElement>(null);
    const [isEditingMembers, setIsEditingMembers] = useState<boolean>(false);

    function onFilteringLabelSelected(labelId: number) {
        props.setCurrentFilteringLabels(labels => [...labels, labelId]);
    }

    function onFilteringLabelUnselected(labelId: number) {
        props.setCurrentFilteringLabels(props.currentFilteringLabels.filter(filteringLabelId => filteringLabelId !== labelId));
    }

    function startEditingLabels(onTarget: HTMLElement) {
        seeLabelsButtonRef.current = onTarget;
        setIsEditingLabels(true);
    }

    function getLabelJsxFor(labelId: number) {
        const label: Label | undefined = kanbanState.labels.get(labelId);
        if (!label) return null;

        const rgb: Rgb = toRgb(label.labelColor);
        return (
            <div key={labelId} onClick={(e) => startEditingLabels(e.currentTarget)}
                 className="board-label"
                 style={{ backgroundColor: `rgb(${rgb.red},${rgb.green},${rgb.blue})` }}>
                <p>{label.labelText}</p>
            </div>
        )
    }

    return (
        <div className="current-board-header">
            { permissions.hasManageBoardUsersPermission() && (
                <>
                    <img src="/settings-icon.svg" alt="Settings" style={{ height: "36px", marginRight: "1rem" }}
                         ref={boardMembersButtonRef} onClick={() => setIsEditingMembers(true)}
                         className="icon clickable"/>
                    { isEditingMembers && (
                        <BoardUserSelector element={boardMembersButtonRef} close={() => setIsEditingMembers(false)}/>
                    )}
                </>
            )}

            <p>Labels: </p>
            {
                props.currentFilteringLabels.length > 0 ? (
                    <div className="board-labels">
                        {
                            props.currentFilteringLabels.map((labelId: number) => {
                                return getLabelJsxFor(labelId);
                            })
                        }
                    </div>
                ) : (
                    <button className="button standard-button"
                            onClick={(e) => startEditingLabels(e.currentTarget)}>All</button>
                )
            }

            { isEditingLabels && <LabelSelector element={seeLabelsButtonRef} onClose={() => setIsEditingLabels(false)}
                                                actionTitle="Filter labels"
                                                selectedLabels={props.currentFilteringLabels}
                                                onLabelSelected={onFilteringLabelSelected} onLabelUnselected={onFilteringLabelUnselected}
                                                selectable/>
            }
        </div>
    )

}

export default BoardCompHeader;