import type {HubContextState} from "./HubContextState.ts";
import {useContext} from "react";
import {BoardHubContext} from "./HubContext.ts";

export function useRealtimeHub(): HubContextState { return useContext(BoardHubContext) }