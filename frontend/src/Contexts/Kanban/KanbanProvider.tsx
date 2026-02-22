import { KanbanDispatchContext, KanbanStateContext } from "./KanbanContexts.ts";
import { type ReactNode, useReducer } from "react";
import kanbanReducer from "../../Reducer/kanbanReducer.ts";
import { InitialState } from "./InitialState.ts";

const KanbanProvider = ( props: { children: ReactNode } ) => {

    const [state, dispatch] = useReducer(kanbanReducer, InitialState);

    return (
        <KanbanStateContext.Provider value={state}>
            <KanbanDispatchContext.Provider value={dispatch}>
                { props.children }
            </KanbanDispatchContext.Provider>
        </KanbanStateContext.Provider>
    )

}

export default KanbanProvider;