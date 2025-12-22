import type { InitBoardPayload } from "../Action.ts";
import type {Card, CardList, State} from "../../../../Models/States/types.ts";
import type { CardListGetDto } from "../../../../Models/BackendDtos/GetDtos/CardListGetDto.ts";

const initBoardAction = (state: State, payload: InitBoardPayload) => {

    const cardLists: Record<number, CardList> = {};
    const cards: Record<number, Card> = {};
    const cardListsDtos: CardListGetDto[] = payload.boardGetDto.cardLists;

    for (const cardListDto of cardListsDtos) {
        cardLists[cardListDto.cardListId] = {
            boardId: payload.boardId,
            cardListId: cardListDto.cardListId,
            cardListName: cardListDto.cardListName
        }
        for (const cardDto of cardListDto.cards) {
            cards[cardDto.cardId] = {
                cardListId: cardListDto.cardListId,
                cardId: cardDto.cardId,
                cardName: cardDto.cardName
            }
        }
    }

    return {
        ...state,
        cardLists: cardLists,
        cards: cards
    }

}

export default initBoardAction;