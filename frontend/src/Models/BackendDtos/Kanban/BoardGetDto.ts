import type { CardListGetDto } from "./CardListGetDto.ts";

export type BoardGetDto = {
    boardId: number;
    boardName: string;
    ownedByUserId: string;
    cardLists: CardListGetDto[];
}