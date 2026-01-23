import type {HubConnection} from "@microsoft/signalr";
import type {Dispatch} from "react";
import type {Action} from "../../Kanban/Actions/Action.ts";
import type {ChecklistGetDto} from "../../../Models/BackendDtos/GetDtos/ChecklistGetDto.ts";

export function buildChecklistConnection(hubConnection: HubConnection, dispatch: Dispatch<Action>) {
    hubConnection.on("CreateChecklist", (cardId: number, checklist: ChecklistGetDto) => {
        dispatch({ type: "CREATE_CHECKLIST_OPTIMISTIC", payload: {
                checklistId: checklist.checklistId,
                checklistName: checklist.checklistName,
                cardId: cardId
            } })
    });

    hubConnection.on("UpdateChecklist", (_cardId: number, checklist: ChecklistGetDto) => {
        dispatch({ type: "UPDATE_CHECKLIST", payload: { checklistId: checklist.checklistId, checklistName: checklist.checklistName } });
    });

    hubConnection.on("DeleteChecklist", (checklistId: number) => {
        dispatch({ type: "DELETE_CHECKLIST", payload: { checklistId: checklistId } });
    })
}