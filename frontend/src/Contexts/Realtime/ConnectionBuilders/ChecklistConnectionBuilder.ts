import type {HubConnection} from "@microsoft/signalr";
import type {Dispatch} from "react";
import type {Action} from "../../Kanban/Actions/Action.ts";
import type {ChecklistGetDto} from "../../../Models/BackendDtos/GetDtos/ChecklistGetDto.ts";
import type {ChecklistItemGetDto} from "../../../Models/BackendDtos/GetDtos/ChecklistItemGetDto.ts";

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
    });

    hubConnection.on("CreateChecklistItemOnChecklist", (checklistId: number, checklistItemGetDto: ChecklistItemGetDto) => {
        dispatch({ type: "CREATE_CHECKLIST_ITEM_OPTIMISTIC", payload: {
                checklistId: checklistId,
                checklistItemId: checklistItemGetDto.checklistItemId,
                checklistItemName: checklistItemGetDto.checklistItemName,
        } })
    });

    hubConnection.on("UpdateChecklistItem", (_checklistId: number, checklistItemGetDto: ChecklistItemGetDto) => {
        dispatch({ type: "UPDATE_CHECKLIST_ITEM", payload: {
                checklistItemId: checklistItemGetDto.checklistItemId,
                checklistItemName: checklistItemGetDto.checklistItemName,
                isDone: checklistItemGetDto.isDone
            } })
    });

    hubConnection.on("PatchChecklistItemDoneState", (checklistItemId: number, taskDone: boolean) => {
        dispatch({ type: "CHANGE_CHECKLIST_ITEM_STATE", payload: { checklistItemId: checklistItemId, newState: taskDone } })
    })

    hubConnection.on("DeleteChecklistItemFromChecklist", (checklistItemId: number) => {
        dispatch({ type: "DELETE_CHECKLIST_ITEM", payload: { checklistItemId: checklistItemId } })
    })
}