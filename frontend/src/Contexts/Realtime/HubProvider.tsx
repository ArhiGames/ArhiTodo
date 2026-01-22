import {type ReactNode, useState} from "react";
import {BoardHubContext} from "./HubContext.ts";
import type {HubConnection} from "@microsoft/signalr";

const HubProvider = (props: { children: ReactNode }) => {

    const [hubConnection, setHubConnection] = useState<HubConnection | undefined>();

    return (
        <BoardHubContext.Provider
            value={{
                hubConnection: hubConnection,
                setHubConnection: setHubConnection,
            }}>
            {props.children}
        </BoardHubContext.Provider>
    )

}

export default HubProvider;