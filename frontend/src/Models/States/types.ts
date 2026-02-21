import type {Claim} from "../Claim.ts";

export type Project = {
    projectId: number;
    projectName: string;
    ownedByUserId: string;
}

export type ProjectPermission = {
    projectId: number;
    isManager: boolean;
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

export type DragDropState = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    source: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any;
    targetIndex: number;
}

export interface State {
    projects: Map<number, Project>;
    projectPermission: Map<number, ProjectPermission>;
    boards: Map<number, Board>;
    boardUserClaims: Map<number, Claim[]>;
    cardLists: Map<number, CardList>;
    cards: Map<number, Card>;
    labels: Map<number, Label>;
    cardLabels: Map<number, number[]>; // cardId <-> labelIds
    checklists: Map<number, Checklist>;
    checklistItems: Map<number, ChecklistItem>;
    dragOverState: DragDropState | null;
}