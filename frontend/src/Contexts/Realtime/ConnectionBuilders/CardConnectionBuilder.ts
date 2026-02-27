import type {HubConnection} from "@microsoft/signalr";
import type {Dispatch} from "react";
import type {KanbanAction} from "../../Kanban/Actions/KanbanAction.ts";
import type {CardGetDto} from "../../../Models/BackendDtos/Kanban/CardGetDto.ts";

export function buildCardConnection(hubConnection: HubConnection, dispatch: Dispatch<KanbanAction>) {
    hubConnection.on("CreateCard", (_boardId: number, cardListId: number, card: CardGetDto) => {
        dispatch({ type: "CREATE_CARD_OPTIMISTIC", payload: { cardListId: cardListId, cardId: card.cardId, cardName: card.cardName } });
    });

    hubConnection.on("DeleteCard", (cardId: number) => {
        dispatch({ type: "DELETE_CARD", payload: { cardId: cardId } });
    });

    hubConnection.on("MoveCard", (cardId: number, toCardListId: number, toIndex: number) => {
        dispatch({ type: "MOVE_CARD", payload: { cardId: cardId, toCardListId: toCardListId, toIndex: toIndex } });
    });

    hubConnection.on("AssignUser", (cardId: number, userId: string) => {
        dispatch({ type: "ASSIGN_CARD_MEMBER", payload: { cardId: cardId, assignedUserId: userId } });
    });

    hubConnection.on("UpdateCardUrgencyLevel", (cardId: number, cardUrgencyLevel: number) => {
        dispatch({ type: "UPDATE_CARD_URGENCY", payload: { cardId: cardId, newUrgencyLevel: cardUrgencyLevel } });
    })

    hubConnection.on("RemoveAssignedUser", (cardId: number, userId: string) => {
        dispatch({ type: "REMOVE_ASSIGNED_CARD_MEMBER", payload: { cardId: cardId, assignedUserId: userId } });
    });

    hubConnection.on("PatchCardName", (cardId: number, cardGetDto: CardGetDto) => {
        dispatch({ type: "UPDATE_CARD_NAME", payload: { cardId: cardId, cardName: cardGetDto.cardName } });
    });

    hubConnection.on("PathCardStatus", (cardId: number, isDone: boolean) => {
        dispatch({ type: "UPDATE_CARD_STATE", payload: { cardId: cardId, newState: isDone } });
    });
}