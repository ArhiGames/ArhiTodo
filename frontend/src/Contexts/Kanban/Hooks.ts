import type { KanbanState } from "../../Models/States/KanbanState.ts";
import {useContext} from "react";
import {KanbanDispatchContext, KanbanStateContext} from "./KanbanContexts.ts";
import type {KanbanAction} from "./Actions/KanbanAction.ts";

export function useKanbanState(): KanbanState { return useContext(KanbanStateContext); }
export function useKanbanDispatch(): React.Dispatch<KanbanAction> | undefined { return useContext(KanbanDispatchContext); }