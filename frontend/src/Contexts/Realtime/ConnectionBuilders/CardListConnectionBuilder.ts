import type {HubConnection} from "@microsoft/signalr";
import type {Dispatch} from "react";
import type {KanbanAction} from "../../Kanban/Actions/KanbanAction.ts";
import type {CardListGetDto} from "../../../Models/BackendDtos/Kanban/CardListGetDto.ts";

export function buildCardListConnection(hubConnection: HubConnection, dispatch: Dispatch<KanbanAction>) {
    hubConnection.on("CreateCardList", (boardId: number, cardList: CardListGetDto) => {
        if (dispatch) {
            dispatch({ type: "CREATE_CARDLIST_OPTIMISTIC", payload: { boardId, cardListId: cardList.cardListId, cardListName: cardList.cardListName } });
        }
    });

    hubConnection.on("UpdateCardList", (_boardId: number, cardList: CardListGetDto) => {
        if (dispatch) {
            dispatch({ type: "UPDATE_CARDLIST", payload: { cardListId: cardList.cardListId, cardListName: cardList.cardListName } });
        }
    });

    hubConnection.on("MoveCardList", (cardListId: number, toIndex: number) => {
        if (dispatch) {
            dispatch({ type: "MOVE_CARDLIST", payload: { cardListId: cardListId, toIndex: toIndex } });
        }
    })

    hubConnection.on("DeleteCardsFromCardList", (cardListId: number) => {
        if (dispatch) {
            dispatch({ type: "DELETE_CARDS_FROM_CARDLIST", payload: { fromCardListId: cardListId } });
        }
    });

    hubConnection.on("DeleteCardList", (cardListId: number) => {
        if (dispatch) {
            dispatch({ type: "DELETE_CARDLIST", payload: { cardListId: cardListId } });
        }
    });
}