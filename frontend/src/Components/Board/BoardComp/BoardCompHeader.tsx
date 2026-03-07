import LabelSelector from "../../Labels/LabelSelector.tsx";
import type {Board, Label, PublicUserGetDto} from "../../../Models/States/KanbanState.ts";
import {getRgbContrastTextColor, type Rgb, toRgb} from "../../../lib/Functions.ts";
import {type Dispatch, type SetStateAction, useRef, useState} from "react";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import BoardUserSelector from "../UserSelector/BoardUserSelector.tsx";
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import {useParams} from "react-router-dom";
import CardUserIcon from "../../User/CardUserIcon.tsx";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";

interface Props {
    currentFilteringLabels: number[];
    setCurrentFilteringLabels: Dispatch<SetStateAction<number[]>>;
}

const BoardCompHeader = (props: Props) => {

    const kanbanState = useKanbanState();
    const permissions = usePermissions();
    const { appUser } = useAuth();
    const { boardId } = useParams();

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
        setIsEditingLabels((prev: boolean) => !prev);
    }

    function getMembersJsx() {

        const board: Board | undefined = kanbanState.boards.get(Number(boardId));
        if (!board) return null;

        const sortedMembers: PublicUserGetDto[] = [...board.boardMembers].sort((a: PublicUserGetDto, b: PublicUserGetDto) => {
            if (a.userId === appUser?.id) return -1;
            if (b.userId === appUser?.id) return 1;
            return 0;
        });

        const remainingBoardMembers: number = sortedMembers.length - 6;
        return (
            <div className="board-members">
                {sortedMembers.slice(0, 6).map((boardMember: PublicUserGetDto) => {
                    return <CardUserIcon key={boardMember.userId} size="medium" onClick={() => console.log("clicked")} user={boardMember}/>;
                })}
                { remainingBoardMembers > 0 && <div style={{ opacity: ".55" }} className="card-member-card medium">+{remainingBoardMembers}</div> }
            </div>
        )

    }

    function getLabelJsxFor(labelId: number) {
        const label: Label | undefined = kanbanState.labels.get(labelId);
        if (!label) return null;

        const rgb: Rgb = toRgb(label.labelColor);
        return (
            <div key={labelId} onClick={(e) => startEditingLabels(e.currentTarget)} className="board-label"
                 style={{ backgroundColor: `rgb(${rgb.red},${rgb.green},${rgb.blue})`, color: getRgbContrastTextColor(label.labelColor) }}>
                <p>{label.labelText}</p>
            </div>
        )
    }

    return (
        <div className="current-board-header">
            { permissions.hasManageBoardUsersPermission() && (
                <>
                    <img src="/settings-icon.svg" alt="Settings" style={{ height: "36px", marginRight: "1rem" }}
                         ref={boardMembersButtonRef} onClick={() => setIsEditingMembers((prev: boolean) => !prev)}
                         className="icon clickable"/>
                    { isEditingMembers && (
                        <BoardUserSelector element={boardMembersButtonRef} close={() => setIsEditingMembers(false)}/>
                    )}
                </>
            )}

            <section>
                <p>Members: </p>
                { getMembersJsx() }
            </section>

            <section>
                <p>Labels: </p>
                {props.currentFilteringLabels.length > 0 ? (
                    <div className="board-labels">
                        {props.currentFilteringLabels.map((labelId: number) => {
                            return getLabelJsxFor(labelId);
                        })}
                    </div>
                ) : (
                    <button className="button standard-button" style={{ width: "12rem" }}
                            onClick={(e) => startEditingLabels(e.currentTarget)}>All</button>
                )}

                { isEditingLabels && <LabelSelector element={seeLabelsButtonRef} onClose={() => setIsEditingLabels(false)}
                                                    actionTitle="Filter labels"
                                                    selectedLabels={props.currentFilteringLabels}
                                                    onLabelSelected={onFilteringLabelSelected} onLabelUnselected={onFilteringLabelUnselected}
                                                    selectable/>
                }
            </section>
        </div>
    )

}

export default BoardCompHeader;