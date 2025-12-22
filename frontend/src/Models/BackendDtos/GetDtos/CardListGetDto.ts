import type { CardGetDto } from "./CardGetDto.ts";

export type CardListGetDto = {
    cardListId: number;
    cardListName: string;
    cards: CardGetDto[];
}