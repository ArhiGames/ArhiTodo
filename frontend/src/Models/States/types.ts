export type Board = {
    boardId: number;
    boardName: string;
}

export type CardList = {
    cardListId: number;
    cardListName: string;
    boardId: number;
}

export type Card = {
    cardId: number;
    cardName: string;
    cardListId: number;
}

export interface State {
    boards: Record<number, Board>;
    cardLists: Record<number, CardList>;
    cards: Record<number, Card>;
}