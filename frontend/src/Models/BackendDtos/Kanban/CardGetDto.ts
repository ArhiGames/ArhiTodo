import type {ChecklistGetDto} from "./ChecklistGetDto.ts";

export type CardGetDto = {
    cardId: number;
    position?: string;
    cardName: string;
    cardDescription: string;
    isDone: boolean;
    cardUrgencyLevel: number;
    labelIds: number[];
    assignedUserIds: string[];
    checklists: ChecklistGetDto[];
}