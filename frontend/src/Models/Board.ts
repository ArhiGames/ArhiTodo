import type { CardList } from "./CardList.ts";

export interface Board {
    boardId: number;
    boardName: string;
    cardLists: CardList[];
}