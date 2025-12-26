import type { InitBoardPayload } from "../Action.ts";
import type {Card, CardList, Label, State} from "../../../../Models/States/types.ts";
import type { CardListGetDto } from "../../../../Models/BackendDtos/GetDtos/CardListGetDto.ts";
import type {LabelGetDto} from "../../../../Models/BackendDtos/GetDtos/LabelGetDto.ts";

const initBoardAction = (state: State, payload: InitBoardPayload) => {

    const cardLists: Record<number, CardList> = {};
    const cardListsDtos: CardListGetDto[] = payload.boardGetDto.cardLists;
    const cards: Record<number, Card> = {};
    const labels: Record<number, Label> = {};
    const labelsDtos: LabelGetDto[] = payload.labels;

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

    for (const labelDto of labelsDtos) {
        labels[labelDto.labelId] = {
            ...labelDto,
            boardId: payload.boardId
        }
    }

    return {
        ...state,
        cardLists: cardLists,
        cards: cards,
        labels: labels
    }

}

export default initBoardAction;