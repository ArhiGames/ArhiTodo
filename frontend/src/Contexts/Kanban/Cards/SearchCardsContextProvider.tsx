import {useState} from "react";
import { SearchCardsContext } from "./SearchCardsContexts";

interface Props {
    children: React.ReactNode;
}

const SearchCardsContextProvider = ({ children }: Props) => {

    const [searchString, setSearchString] = useState<string>("");
    const [filteringLabels, setFilteringLabels] = useState<number[]>([]);
    const [filteringUrgencyLevels, setFilteringUrgencyLevels] = useState<number[]>([]);
    const [filteringUserIds, setFilteringUserIds] = useState<string[]>([]);
    const [showCompletedCards, setShowCompletedCards] = useState<boolean>(false);

    return (
        <SearchCardsContext.Provider value={{
            searchString, setSearchString,
            filteringLabels, setFilteringLabels,
            filteringUrgencyLevels, setFilteringUrgencyLevels,
            filteringUserIds, setFilteringUserIds,
            showCompletedCards, setShowCompletedCards,
        }}>
            {children}
        </SearchCardsContext.Provider>
    )

}

export default SearchCardsContextProvider;