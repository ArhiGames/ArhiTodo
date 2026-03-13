import {createContext, type Dispatch, type SetStateAction, useContext} from "react";

export type SearchContextType = {
    searchString: string;
    setSearchString: Dispatch<SetStateAction<string>>;
    filteringLabels: number[];
    setFilteringLabels: Dispatch<SetStateAction<number[]>>;
    filteringUrgencyLevels: number[];
    setFilteringUrgencyLevels: Dispatch<SetStateAction<number[]>>;
    filteringUserIds: string[];
    setFilteringUserIds: Dispatch<SetStateAction<string[]>>;
    showCompletedCards: boolean;
    setShowCompletedCards: Dispatch<SetStateAction<boolean>>;
}

export const SearchCardsContext = createContext<SearchContextType>({
    searchString: "",
    setSearchString: () => "",
    filteringLabels: [],
    setFilteringLabels: () => [],
    filteringUrgencyLevels: [],
    setFilteringUrgencyLevels: () => [],
    filteringUserIds: [],
    setFilteringUserIds: () => [],
    showCompletedCards: true,
    setShowCompletedCards: () => [],
});

export function useCardsSearch() { return useContext<SearchContextType>(SearchCardsContext); }