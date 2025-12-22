import type { State } from "../../Models/States/types.ts";
import {useContext} from "react";
import {KanbanDispatchContext, KanbanStateContext} from "./KanbanContexts.ts";
import type {Action} from "./Actions/Action.ts";

export function useKanbanState(): State { return useContext(KanbanStateContext); }
export function useKanbanDispatch(): React.Dispatch<Action> | undefined { return useContext(KanbanDispatchContext); }