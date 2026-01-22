import {createContext} from "react";
import type {HubContextState} from "./HubContextState.ts";
import type {HubConnection} from "@microsoft/signalr";

export const BoardHubContext = createContext<HubContextState>({
    hubConnection: undefined,
    setHubConnection(hubConnection: HubConnection): void { console.log("hubConnection", hubConnection); }
});