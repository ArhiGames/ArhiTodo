import {createContext, type Dispatch, type SetStateAction, useContext} from "react";

export type SearchContextType = {
    searchString: string;
    setSearchString: Dispatch<SetStateAction<string>>;
    filteringLabels: number[];
    setFilteringLabels: Dispatch<SetStateAction<number[]>>;
}

export const SearchCardsContext = createContext<SearchContextType>({
    searchString: "",
    setSearchString: () => "",
    filteringLabels: [],
    setFilteringLabels: () => [],
});

export function useCardsSearch() { return useContext<SearchContextType>(SearchCardsContext); }