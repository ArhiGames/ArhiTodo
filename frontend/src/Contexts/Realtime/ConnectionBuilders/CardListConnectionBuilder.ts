import type {HubConnection} from "@microsoft/signalr";
import type {Dispatch} from "react";
import type {Action} from "../../Kanban/Actions/Action.ts";
import type {CardListGetDto} from "../../../Models/BackendDtos/GetDtos/CardListGetDto.ts";

export function buildCardListConnection(hubConnection: HubConnection, dispatch: Dispatch<Action>) {
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