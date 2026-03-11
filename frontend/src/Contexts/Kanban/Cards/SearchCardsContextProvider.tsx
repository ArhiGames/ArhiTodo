import {useState} from "react";
import { SearchCardsContext } from "./SearchCardsContexts";

interface Props {
    children: React.ReactNode;
}

const SearchCardsContextProvider = ({ children }: Props) => {

    const [searchString, setSearchString] = useState<string>("");
    const [filteringLabels, setFilteringLabels] = useState<number[]>([]);

    return (
        <SearchCardsContext.Provider value={{ searchString, setSearchString, filteringLabels, setFilteringLabels }}>
            {children}
        </SearchCardsContext.Provider>
    )

}

export default SearchCardsContextProvider;