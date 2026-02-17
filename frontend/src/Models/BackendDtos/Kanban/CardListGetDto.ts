import type { CardGetDto } from "./CardGetDto.ts";

export type CardListGetDto = {
    cardListId: number;
    position?: string;
    cardListName: string;
    cards: CardGetDto[];
}