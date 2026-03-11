import {useRef, useState} from "react";
import Popover from "../../../lib/Popover/Popover.tsx";
import FancyCheckbox from "../../../lib/Input/Checkbox/FancyCheckbox.tsx";
import {useCardsSearch} from "../../../Contexts/Kanban/Cards/SearchCardsContexts.ts";

const UrgencyFilterComp = () => {

    const [isEditingUrgencyFilter, setIsEditingUrgencyFilter] = useState<boolean>(false);
    const triggerButtonRef = useRef<HTMLElement>(null);

    const cardSearch = useCardsSearch();
    const urgencies: string[] = ["No-priority", "Low", "Medium", "High", "Urgent"];

    function onEditUrgencyFilterPressed(e: React.MouseEvent<HTMLElement>) {
        setIsEditingUrgencyFilter((prev) => !prev);
        triggerButtonRef.current = e.currentTarget;
    }

    function updateCardUrgencyFilter(checked: boolean, filterLevel: number) {
        if (checked) {
            if (filterLevel === 0) {
                cardSearch.setFilteringUrgencyLevels([]);
                return;
            }
            cardSearch.setFilteringUrgencyLevels((prev) => [...prev, filterLevel].sort((a, b) => b - a));
        } else {
            cardSearch.setFilteringUrgencyLevels((prev) => prev.filter((urgencyLevel: number) => urgencyLevel != filterLevel));
        }
    }

    function isCardUrgencyFiltered(index: number): boolean {
        if (index === 0) {
            return cardSearch.filteringUrgencyLevels.length === 0;

        }
        return cardSearch.filteringUrgencyLevels.some((filteringUrgencyLevel: number) => filteringUrgencyLevel === index);
    }

    return (
        <>
            <section>
                <p onClick={onEditUrgencyFilterPressed}>Urgency</p>
                { cardSearch.filteringUrgencyLevels.length === 0 ? (
                    <button className="button standard-button" style={{ width: "8rem" }} onClick={onEditUrgencyFilterPressed}>Any</button>
                    ) : (
                    <div className="filtered-for-urgencies">
                        {cardSearch.filteringUrgencyLevels.map((urgencyLevel: number) => {
                            return (
                                <img src={`/urgency-${urgencies[urgencyLevel].toLowerCase()}.svg`} alt="" onClick={onEditUrgencyFilterPressed}
                                     height="16px" className={`urgency-imgsvg clickable ${urgencies[urgencyLevel].toLowerCase()}`}/>
                            )
                        })}
                    </div>
                )}
            </section>
            {isEditingUrgencyFilter && (
                <Popover close={() => setIsEditingUrgencyFilter(false)} element={triggerButtonRef} triggerElement={triggerButtonRef}>
                    <div className="filters-urgencies">
                        {urgencies.map((urgency: string, index: number) => {
                            return (
                                <div className={`filter-urgency ${urgency}`}>
                                    <FancyCheckbox value={isCardUrgencyFiltered(index)} onChange={(checked: boolean) => updateCardUrgencyFilter(checked, index)}/>
                                    <img src={`/urgency-${urgency.toLowerCase()}.svg`} alt=""
                                         height="16px" className={`urgency-imgsvg ${urgency.toLowerCase()}`}/>
                                    <p>{urgency.replace("-", " ")}</p>
                                </div>
                            )
                        })}
                    </div>
                </Popover>
            )}
        </>
    )

}

export default UrgencyFilterComp;