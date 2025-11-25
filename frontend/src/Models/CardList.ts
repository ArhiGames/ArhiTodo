import type { Card } from "./Card.ts";

export interface CardList {
    cardListId: number;
    cardName: string;
    cards: Card[];
}