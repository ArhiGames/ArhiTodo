export type Project = {
    projectId: number;
    projectName: string;
    ownedByUserId: string;
}

export interface PublicUserGetDto {
    userId: string;
    userName: string;
    email: string;
}

export type Board = {
    projectId: number;
    boardId: number;
    boardName: string;
    ownedByUserId: string;
    boardMembers: PublicUserGetDto[];
}

export type CardList = {
    cardListId: number;
    cardListName: string;
    boardId: number;
    cardIds: number[];
}

export type Card = {
    cardListId: number;
    cardId: number;
    cardName: string;
    cardDescription: string;
    isDone: boolean;
    assignedUserIds: string[];
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

export interface KanbanState {
    projects: Map<number, Project>;
    boards: Map<number, Board>;
    cardLists: Map<number, CardList>;
    cards: Map<number, Card>;
    labels: Map<number, Label>;
    cardLabels: Map<number, number[]>; // cardId <-> labelIds
    checklists: Map<number, Checklist>;
    checklistItems: Map<number, ChecklistItem>;
}