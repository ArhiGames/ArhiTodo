import type { InitBoardPayload } from "../Action.ts";
import type {Card, CardList, Checklist, ChecklistItem, Label, State} from "../../../../Models/States/types.ts";
import type { CardListGetDto } from "../../../../Models/BackendDtos/Kanban/CardListGetDto.ts";
import type {LabelGetDto} from "../../../../Models/BackendDtos/Kanban/LabelGetDto.ts";

const initBoardAction = (state: State, payload: InitBoardPayload) => {

    const cardLists: Record<number, CardList> = {};
    const cardListsDtos: CardListGetDto[] = payload.boardGetDto.cardLists;
    const cards: Record<number, Card> = {};
    const labels: Record<number, Label> = {};
    const labelsDtos: LabelGetDto[] = payload.labels;
    const cardLabels: Record<number, number[]> = {}; // cardId <-> labelIds
    const checklists: Record<number, Checklist> = {};
    const checklistItems: Record<number, ChecklistItem> = {};

    for (const cardListDto of cardListsDtos) {
        cardLists[cardListDto.cardListId] = {
            boardId: payload.boardId,
            cardListId: cardListDto.cardListId,
            cardListName: cardListDto.cardListName
        }
        for (const cardDto of cardListDto.cards) {
            cards[cardDto.cardId] = {
                cardId: cardDto.cardId,
                cardName: cardDto.cardName,
                isDone: cardDto.isDone,
                cardListId: cardListDto.cardListId
            }
            if (!cardLabels[cardDto.cardId]) {
                cardLabels[cardDto.cardId] = [];
            }
            for (const labelId of cardDto.labelIds) {
                cardLabels[cardDto.cardId].push(labelId);
            }

            for (const checklist of cardDto.checklists) {
                checklists[checklist.checklistId] = {
                    checklistId: checklist.checklistId,
                    checklistName: checklist.checklistName,
                    cardId: cardDto.cardId
                }
                for (const checklistItem of checklist.checklistItems) {
                    checklistItems[checklistItem.checklistItemId] = {
                        checklistItemId: checklistItem.checklistItemId,
                        checklistItemName: checklistItem.checklistItemName,
                        isDone: checklistItem.isDone,
                        checklistId: checklist.checklistId
                    }
                }
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
        labels: labels,
        cardLabels: cardLabels,
        checklists: checklists,
        checklistItems: checklistItems
    }

}

export default initBoardAction;