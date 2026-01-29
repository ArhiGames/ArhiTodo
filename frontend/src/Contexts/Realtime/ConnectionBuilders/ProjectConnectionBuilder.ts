import type {HubConnection} from "@microsoft/signalr";
import type {Dispatch} from "react";
import type {Action} from "../../Kanban/Actions/Action.ts";
import type {ProjectGetDto} from "../../../Models/BackendDtos/GetDtos/ProjectGetDto.ts";

export function buildProjectConnection(hubConnection: HubConnection, dispatch: Dispatch<Action>) {
    hubConnection.on("DeleteProject", (projectId: number) => {
        dispatch({ type: "DELETE_PROJECT", payload: { projectId: projectId } });
    })

    hubConnection.on("UpdateProject", (projectGetDto: ProjectGetDto) => {
        dispatch({ type: "UPDATE_PROJECT", payload: { projectId: projectGetDto.projectId, projectName: projectGetDto.projectName } });
    })
}