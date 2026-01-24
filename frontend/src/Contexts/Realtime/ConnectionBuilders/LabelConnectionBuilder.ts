import type {HubConnection} from "@microsoft/signalr";
import type {Dispatch} from "react";
import type {Action} from "../../Kanban/Actions/Action.ts";
import type {LabelGetDto} from "../../../Models/BackendDtos/GetDtos/LabelGetDto.ts";

export function buildLabelConnection(hubConnection: HubConnection, dispatch: Dispatch<Action>) {
    hubConnection.on("CreateLabel", (boardId: number, labelGetDto: LabelGetDto) => {
        dispatch({ type: "CREATE_LABEL_OPTIMISTIC", payload: {
                boardId: boardId,
                labelId: labelGetDto.labelId,
                labelText: labelGetDto.labelText,
                labelColor: labelGetDto.labelColor } });
    });

    hubConnection.on("UpdateLabel", (_boardId: number, labelGetDto: LabelGetDto) => {
        dispatch({ type: "UPDATE_LABEL", payload: {
            labelId: labelGetDto.labelId,
            labelText: labelGetDto.labelText,
            labelColor: labelGetDto.labelColor } });
    });

    hubConnection.on("DeleteLabel", (labelId: number) => {
        dispatch({ type: "DELETE_LABEL", payload: { labelId: labelId } });
    });
}