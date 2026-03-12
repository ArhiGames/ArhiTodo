import {useCardsSearch} from "../../../Contexts/Kanban/Cards/SearchCardsContexts.ts";
import BoardCompHeaderFilteringLabelsComp from "./BoardCompHeaderFilteringLabelsComp.tsx";
import UrgencyFilterComp from "./UrgencyFilterComp.tsx";
import BoardCompHeaderMembersComp from "./BoardCompHeaderMembersComp.tsx";

const BoardCompHeader = () => {

    const searchCards = useCardsSearch();

    return (
        <div className="current-board-header">
            <BoardCompHeaderMembersComp/>
            <BoardCompHeaderFilteringLabelsComp/>
            <UrgencyFilterComp/>
            <section>
                <div className="cards-search-bar">
                    <input type="text" className="classic-input small" placeholder="Search cards..."
                           value={searchCards.searchString} onChange={(e) => searchCards.setSearchString(e.target.value)}/>
                    <img src="/search-icon.svg" alt="" className="icon" height="24px"/>
                </div>
            </section>
        </div>
    )

}

export default BoardCompHeader;