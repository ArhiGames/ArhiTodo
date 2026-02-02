import LabelSelector from "../Labels/LabelSelector.tsx";
import type {Label} from "../../Models/States/types.ts";
import {type Rgb, toRgb} from "../../lib/Functions.ts";
import {type Dispatch, type SetStateAction, useRef, useState} from "react";
import {useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import {useParams} from "react-router-dom";
import BoardUserSelector from "./UserSelector/BoardUserSelector.tsx";

interface Props {
    currentFilteringLabels: number[];
    setCurrentFilteringLabels: Dispatch<SetStateAction<number[]>>;
}

const BoardCompHeader = (props: Props) => {

    const kanbanState = useKanbanState();
    const { projectId, boardId } = useParams();

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
        const label: Label = kanbanState.labels[labelId];
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
            <img src="/settings-icon.svg" alt="Settings" style={{ height: "36px" }} ref={boardMembersButtonRef} onClick={() => setIsEditingMembers(true)}
                 className="icon clickable"/>
            { isEditingMembers && (
                <BoardUserSelector element={boardMembersButtonRef} close={() => setIsEditingMembers(false)}/>
            )}
            <p style={{ marginLeft: "1rem" }}>Labels: </p>
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
                                                boardId={Number(boardId)} projectId={Number(projectId)}
                                                selectedLabels={props.currentFilteringLabels}
                                                onLabelSelected={onFilteringLabelSelected} onLabelUnselected={onFilteringLabelUnselected}/>
            }
        </div>
    )

}

export default BoardCompHeader;