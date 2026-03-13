import {useCardsSearch} from "../../../Contexts/Kanban/Cards/SearchCardsContexts.ts";
import BoardCompHeaderFilteringLabelsComp from "./BoardCompHeaderFilteringLabelsComp.tsx";
import UrgencyFilterComp from "./UrgencyFilterComp.tsx";
import BoardCompHeaderMembersComp from "./BoardCompHeaderMembersComp.tsx";
import {useRef} from "react";

const BoardCompHeader = () => {

    const searchCards = useCardsSearch();
    const searchCardsInputRef = useRef<HTMLInputElement>(null);

    function onFilterCompletedCardsPressed() {
        searchCards.setShowCompletedCards((prev) => !prev);
    }

    return (
        <div className="current-board-header">
            <BoardCompHeaderMembersComp/>
            <BoardCompHeaderFilteringLabelsComp/>
            <UrgencyFilterComp/>
            <section>
                <div className="cards-search-bar">
                    <input type="text" className="classic-input small" placeholder="Search cards..." ref={searchCardsInputRef}
                           value={searchCards.searchString} onChange={(e) => searchCards.setSearchString(e.target.value)}/>
                    <img src="/search-icon.svg" alt="" className="icon clickable" height="24px" onClick={() => searchCardsInputRef.current?.focus()}/>
                </div>
            </section>
            <section>
                <div className="filter-completed-cards-container">
                    <p>Completed</p>
                    <img src={searchCards.showCompletedCards ? "/eye.svg" : "/crossed-eye.svg"}
                         alt="Completed" height="36px" className="filter-completed-cards icon clickable" onClick={onFilterCompletedCardsPressed}/>
                </div>
            </section>
        </div>
    )

}

export default BoardCompHeader;