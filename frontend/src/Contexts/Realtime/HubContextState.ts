import type {HubConnection} from "@microsoft/signalr";

export type HubContextState = {
    hubConnection: HubConnection | undefined;
    setHubConnection: (hubConnection: HubConnection) => void;
}