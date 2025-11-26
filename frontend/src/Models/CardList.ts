import type { Card } from "./Card.ts";

export interface CardList {
    cardListId: number;
    cardListName: string;
    cards: Card[];
}