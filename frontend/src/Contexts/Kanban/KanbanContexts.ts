import {createContext, type Dispatch} from "react";
import type { KanbanState } from "../../Models/States/KanbanState.ts";
import type { KanbanAction } from "./Actions/KanbanAction.ts";
import { InitialState } from "./InitialState.ts";

export const KanbanStateContext = createContext<KanbanState>(InitialState);
export const KanbanDispatchContext = createContext<Dispatch<KanbanAction> | undefined>(undefined);