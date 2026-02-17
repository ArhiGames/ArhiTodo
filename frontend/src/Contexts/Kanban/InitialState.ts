import type { State } from "../../Models/States/types.ts";

export const InitialState: State = {
    projects: new Map(),
    projectPermission: new Map(),
    boards: new Map(),
    boardUserClaims: new Map(),
    cardLists: new Map(),
    cards: new Map(),
    labels: new Map(),
    cardLabels: new Map(),
    checklists: new Map(),
    checklistItems: new Map()
}