import type { InitBoardPayload } from "../../KanbanAction.ts";
import type {Card, CardList, Checklist, ChecklistItem, Label, KanbanState} from "../../../../../Models/States/KanbanState.ts";
import type { CardListGetDto } from "../../../../../Models/BackendDtos/Kanban/CardListGetDto.ts";
import type {LabelGetDto} from "../../../../../Models/BackendDtos/Kanban/LabelGetDto.ts";
import type {CardGetDto} from "../../../../../Models/BackendDtos/Kanban/CardGetDto.ts";

const initBoardAction = (state: KanbanState, payload: InitBoardPayload) => {

    const cardLists: Map<number, CardList> = new Map();
    const cardListsDtos: CardListGetDto[] = payload.boardGetDto.cardLists;
    const cards: Map<number, Card> = new Map();
    const labels: Map<number, Label> = new Map();
    const labelsDtos: LabelGetDto[] = payload.boardGetDto.labels;
    const cardLabels: Map<number, number[]> = new Map(); // cardId <-> labelIds
    const checklists: Map<number, Checklist> = new Map();
    const checklistItems: Map<number, ChecklistItem> = new Map();

    for (const cardListDto of cardListsDtos) {
        const cardIds: number[] = [];
        cardLists.set(cardListDto.cardListId, {
            boardId: payload.boardId,
            cardListId: cardListDto.cardListId,
            cardListName: cardListDto.cardListName,
            cardIds: cardIds
        });
        for (const cardDto of cardListDto.cards.sort((a: CardGetDto, b: CardGetDto) => a.position! > b.position! ? 1 : -1)) {
            cardIds.push(cardDto.cardId);

            cards.set(cardDto.cardId, {
                cardListId: cardListDto.cardListId,
                cardId: cardDto.cardId,
                cardName: cardDto.cardName,
                cardDescription: cardDto.cardDescription,
                isDone: cardDto.isDone,
                cardUrgencyLevel: cardDto.cardUrgencyLevel,
                assignedUserIds: cardDto.assignedUserIds
            });
            if (!cardLabels.get(cardDto.cardId)) {
                cardLabels.set(cardDto.cardId, []);
            }
            for (const labelId of cardDto.labelIds) {
                cardLabels.get(cardDto.cardId)?.push(labelId);
            }

            for (const checklist of cardDto.checklists) {
                checklists.set(checklist.checklistId, {
                    checklistId: checklist.checklistId,
                    checklistName: checklist.checklistName,
                    cardId: cardDto.cardId
                });
                for (const checklistItem of checklist.checklistItems) {
                    checklistItems.set(checklistItem.checklistItemId, {
                        checklistItemId: checklistItem.checklistItemId,
                        checklistItemName: checklistItem.checklistItemName,
                        isDone: checklistItem.isDone,
                        checklistId: checklist.checklistId
                    });
                }
            }
        }
    }

    for (const labelDto of labelsDtos) {
        labels.set(labelDto.labelId, {
            ...labelDto,
            boardId: payload.boardId
        });
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