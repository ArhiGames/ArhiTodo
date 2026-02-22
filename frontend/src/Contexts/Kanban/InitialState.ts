import type { KanbanState } from "../../Models/States/KanbanState.ts";

export const InitialState: KanbanState = {
    projects: new Map(),
    boards: new Map(),
    cardLists: new Map(),
    cards: new Map(),
    labels: new Map(),
    cardLabels: new Map(),
    checklists: new Map(),
    checklistItems: new Map()
}