import { createContext } from "react";
import type { State } from "../../Models/States/types.ts";
import type { Action } from "./Actions/Action.ts";
import { InitialState } from "./InitialState.ts";

export const KanbanStateContext = createContext<State>(InitialState);
export const KanbanDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);