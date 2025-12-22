import { KanbanDispatchContext, KanbanStateContext } from "./KanbanContexts.ts";
import { type ReactNode, useReducer } from "react";
import rootReducer from "../../Reducer/rootReducer.ts";
import { InitialState } from "./InitialState.ts";

const KanbanProvider = ( props: { children: ReactNode } ) => {

    const [state, dispatch] = useReducer(rootReducer, InitialState);

    return (
        <KanbanStateContext.Provider value={state}>
            <KanbanDispatchContext.Provider value={dispatch}>
                { props.children }
            </KanbanDispatchContext.Provider>
        </KanbanStateContext.Provider>
    )

}

export default KanbanProvider;