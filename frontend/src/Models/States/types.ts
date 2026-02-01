export type Project = {
    projectId: number;
    projectName: string;
    ownedByUserId: string;
}

export type Board = {
    projectId: number;
    boardId: number;
    boardName: string;
    ownedByUserId: string;
}

export type CardList = {
    cardListId: number;
    cardListName: string;
    boardId: number;
}

export type Card = {
    cardId: number;
    cardName: string;
    isDone: boolean;
    cardListId: number;
}

export type Label = {
    boardId: number;
    labelId: number;
    labelColor: number;
    labelText: string;
}

export type Checklist = {
    checklistId: number;
    checklistName: string;
    cardId: number;
}

export type ChecklistItem = {
    checklistItemId: number;
    checklistItemName: string;
    isDone: boolean;
    checklistId: number;
}

export interface State {
    projects: Record<number, Project>;
    boards: Record<number, Board>;
    cardLists: Record<number, CardList>;
    cards: Record<number, Card>;
    labels: Record<number, Label>;
    cardLabels: Record<number, number[]>; // cardId <-> labelIds
    checklists: Record<number, Checklist>;
    checklistItems: Record<number, ChecklistItem>;
}