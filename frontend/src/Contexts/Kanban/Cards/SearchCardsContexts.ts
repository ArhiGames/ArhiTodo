import {createContext, type Dispatch, type SetStateAction, useContext} from "react";

export type SearchContextType = {
    searchString: string;
    setSearchString: Dispatch<SetStateAction<string>>;
}

export const SearchCardsContext = createContext<SearchContextType>({
    searchString: "",
    setSearchString: () => ""
});

export function useCardsSearch() { return useContext<SearchContextType>(SearchCardsContext); }