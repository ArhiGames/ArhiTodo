import {useState} from "react";
import { SearchCardsContext } from "./SearchCardsContexts";

interface Props {
    children: React.ReactNode;
}

const SearchCardsContextProvider = ({ children }: Props) => {

    const [searchString, setSearchString] = useState<string>("");

    return (
        <SearchCardsContext.Provider value={{ searchString, setSearchString }}>
            {children}
        </SearchCardsContext.Provider>
    )

}

export default SearchCardsContextProvider;