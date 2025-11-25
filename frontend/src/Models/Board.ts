import type { CardList } from "./CardList.ts";

export interface Board {
    id: number;
    boardName: string;
    cardLists: CardList[];
}