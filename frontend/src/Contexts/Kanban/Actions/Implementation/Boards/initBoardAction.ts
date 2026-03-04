import type { InitBoardPayload } from "../../KanbanAction.ts";
import type {
    Card,
    CardList,
    Checklist,
    ChecklistItem,
    Label,
    KanbanState,
    Board
} from "../../../../../Models/States/KanbanState.ts";
import type { CardListGetDto } from "../../../../../Models/BackendDtos/Kanban/CardListGetDto.ts";
import type {LabelGetDto} from "../../../../../Models/BackendDtos/Kanban/LabelGetDto.ts";
import type {CardGetDto} from "../../../../../Models/BackendDtos/Kanban/CardGetDto.ts";
import type {ChecklistGetDto} from "../../../../../Models/BackendDtos/Kanban/ChecklistGetDto.ts";
import type {ChecklistItemGetDto} from "../../../../../Models/BackendDtos/Kanban/ChecklistItemGetDto.ts";

const initBoardAction = (state: KanbanState, payload: InitBoardPayload) => {

    const existingBoard: Board | undefined = state.boards.get(payload.boardId);
    if (!existingBoard) return state;

    const boards: Map<number, Board> = new Map(state.boards);
    const cardLists: Map<number, CardList> = new Map(state.cardLists);
    const cardListsDtos: CardListGetDto[] = payload.boardGetDto.cardLists;
    const cards: Map<number, Card> = new Map(state.cards);
    const labels: Map<number, Label> = new Map(state.labels);
    const labelsDtos: LabelGetDto[] = payload.boardGetDto.labels;
    const cardLabels: Map<number, number[]> = new Map(state.cardLabels); // cardId <-> labelIds
    const checklists: Map<number, Checklist> = new Map(state.checklists);
    const checklistItems: Map<number, ChecklistItem> = new Map(state.checklistItems);

    const cardListIds: number[] = [];

    for (const cardListDto of cardListsDtos.sort((a: CardListGetDto, b: CardListGetDto) => a.position! > b.position! ? 1 : -1)) {
        cardListIds.push(cardListDto.cardListId);

        const cardIds: number[] = [];
        cardLists.set(cardListDto.cardListId, {
            boardId: payload.boardId,
            cardListId: cardListDto.cardListId,
            cardListName: cardListDto.cardListName,
            cardIds: cardIds
        });
        for (const cardDto of cardListDto.cards.sort((a: CardGetDto, b: CardGetDto) => a.position! > b.position! ? 1 : -1)) {
            cardIds.push(cardDto.cardId);

            if (!cardLabels.get(cardDto.cardId)) {
                cardLabels.set(cardDto.cardId, []);
            }
            for (const labelId of cardDto.labelIds) {
                const labelIds: number[] | undefined = cardLabels.get(cardDto.cardId);
                if (labelIds && !labelIds.includes(labelId)) {
                    labelIds.push(labelId);
                }
            }

            const checklistIds: number[] = [];
            for (const checklist of cardDto.checklists.sort((a: ChecklistGetDto, b: ChecklistGetDto) => a.position! > b.position! ? 1 : -1)) {
                checklistIds.push(checklist.checklistId);

                const checklistItemIds: number[] = [];
                for (const checklistItem of
                    checklist.checklistItems.sort((a: ChecklistItemGetDto, b: ChecklistItemGetDto) => a.position! > b.position! ? 1 : -1))
                {
                    checklistItemIds.push(checklistItem.checklistItemId);
                    checklistItems.set(checklistItem.checklistItemId, {
                        checklistItemId: checklistItem.checklistItemId,
                        checklistItemName: checklistItem.checklistItemName,
                        isDone: checklistItem.isDone,
                        checklistId: checklist.checklistId
                    });
                }

                checklists.set(checklist.checklistId, {
                    checklistId: checklist.checklistId,
                    checklistName: checklist.checklistName,
                    cardId: cardDto.cardId,
                    checklistItemIds: checklistItemIds
                });
            }

            cards.set(cardDto.cardId, {
                cardListId: cardListDto.cardListId,
                cardId: cardDto.cardId,
                cardName: cardDto.cardName,
                cardDescription: cardDto.cardDescription,
                isDone: cardDto.isDone,
                cardUrgencyLevel: cardDto.cardUrgencyLevel,
                assignedUserIds: cardDto.assignedUserIds,
                checklistIds: checklistIds
            });
        }
    }

    boards.set(payload.boardId, {
        ...existingBoard,
        cardListIds: cardListIds,
        labelIds: labelsDtos.sort((a: LabelGetDto, b: LabelGetDto) => a.position! > b.position! ? 1 : -1).map(l => l.labelId)
    })

    for (const labelDto of labelsDtos) {
        labels.set(labelDto.labelId, {
            ...labelDto,
            boardId: payload.boardId
        });
    }

    return {
        ...state,
        boards: boards,
        cardLists: cardLists,
        cards: cards,
        labels: labels,
        cardLabels: cardLabels,
        checklists: checklists,
        checklistItems: checklistItems
    }

}

export default initBoardAction;