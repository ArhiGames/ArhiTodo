import type {HubConnection} from "@microsoft/signalr";
import type {Dispatch} from "react";
import type {KanbanAction} from "../../Kanban/Actions/KanbanAction.ts";
import type {ProjectGetDto} from "../../../Models/BackendDtos/Kanban/ProjectGetDto.ts";

export function buildProjectConnection(hubConnection: HubConnection, dispatch: Dispatch<KanbanAction>) {
    hubConnection.on("DeleteProject", (projectId: number) => {
        dispatch({ type: "DELETE_PROJECT", payload: { projectId: projectId } });
    })

    hubConnection.on("UpdateProject", (projectGetDto: ProjectGetDto) => {
        dispatch({ type: "UPDATE_PROJECT", payload: { projectId: projectGetDto.projectId, projectName: projectGetDto.projectName } });
    })
}