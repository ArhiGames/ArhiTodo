import {useCardsSearch} from "../../../Contexts/Kanban/Cards/SearchCardsContexts.ts";
import LabelSelector from "../../Labels/LabelSelector.tsx";
import {getRgbContrastTextColor, type Rgb, toRgb} from "../../../lib/Functions.ts";
import type {Label} from "../../../Models/States/KanbanState.ts";
import {useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import {useRef, useState} from "react";

const BoardCompHeaderFilteringLabelsComp = () => {

    const kanbanState = useKanbanState();
    const searchCards = useCardsSearch();

    const seeLabelsButtonRef = useRef<HTMLElement | null>(null);
    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);

    function onFilteringLabelSelected(labelId: number) {
        searchCards.setFilteringLabels((prev: number[]) => [...prev, labelId]);
    }

    function onFilteringLabelUnselected(labelId: number) {
        searchCards.setFilteringLabels((prev: number[]) => prev.filter(filteringLabelId => filteringLabelId !== labelId));
    }

    function startEditingLabels(onTarget: HTMLElement) {
        seeLabelsButtonRef.current = onTarget;
        setIsEditingLabels((prev: boolean) => !prev);
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
        <section>
            <p>Labels</p>
            {searchCards.filteringLabels.length > 0 ? (
                <div className="board-labels">
                    {searchCards.filteringLabels.map((labelId: number) => {
                        return getLabelJsxFor(labelId);
                    })}
                </div>
            ) : (
                <button className="button standard-button" style={{ width: "12rem" }}
                        onClick={(e) => startEditingLabels(e.currentTarget)}>All</button>
            )}

            { isEditingLabels && <LabelSelector element={seeLabelsButtonRef} onClose={() => setIsEditingLabels(false)}
                                                actionTitle="Filter labels"
                                                selectedLabels={searchCards.filteringLabels}
                                                onLabelSelected={onFilteringLabelSelected} onLabelUnselected={onFilteringLabelUnselected}
                                                selectable/>
            }
        </section>
    )

}

export default BoardCompHeaderFilteringLabelsComp;