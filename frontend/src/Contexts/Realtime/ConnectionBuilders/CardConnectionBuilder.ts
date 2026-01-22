import type {HubConnection} from "@microsoft/signalr";
import type {Dispatch} from "react";
import type {Action} from "../../Kanban/Actions/Action.ts";
import type {CardGetDto} from "../../../Models/BackendDtos/GetDtos/CardGetDto.ts";

export function buildCardConnection(hubConnection: HubConnection, dispatch: Dispatch<Action>) {
    hubConnection.on("CreateCard", (_boardId: number, cardListId: number, card: CardGetDto) => {
        dispatch({ type: "CREATE_CARD_OPTIMISTIC", payload: { cardListId: cardListId, cardId: card.cardId, cardName: card.cardName } })
    });

    hubConnection.on("DeleteCard", (cardId: number) => {
        dispatch({ type: "DELETE_CARD", payload: { cardId: cardId } })
    });
}