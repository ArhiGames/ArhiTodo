import {createContext, type Dispatch, type SetStateAction, useContext} from "react";

export type SearchContextType = {
    searchString: string;
    setSearchString: Dispatch<SetStateAction<string>>;
    filteringLabels: number[];
    setFilteringLabels: Dispatch<SetStateAction<number[]>>;
    filteringUrgencyLevels: number[];
    setFilteringUrgencyLevels: Dispatch<SetStateAction<number[]>>;
}

export const SearchCardsContext = createContext<SearchContextType>({
    searchString: "",
    setSearchString: () => "",
    filteringLabels: [],
    setFilteringLabels: () => [],
    filteringUrgencyLevels: [],
    setFilteringUrgencyLevels: () => [],
});

export function useCardsSearch() { return useContext<SearchContextType>(SearchCardsContext); }