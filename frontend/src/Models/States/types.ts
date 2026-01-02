export type Board = {
    projectId: number;
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
    isDone: boolean;
    cardName: string;
    cardListId: number;
}

export type Label = {
    boardId: number;
    labelId: number;
    labelColor: number;
    labelText: string;
}

export interface State {
    boards: Record<number, Board>;
    cardLists: Record<number, CardList>;
    cards: Record<number, Card>;
    labels: Record<number, Label>;
    cardLabels: Record<number, number[]>; // cardId <-> labelIds
}