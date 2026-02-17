import type {ChecklistGetDto} from "./ChecklistGetDto.ts";

export type CardGetDto = {
    cardId: number;
    position?: string;
    cardName: string;
    isDone: boolean;
    labelIds: number[];
    checklists: ChecklistGetDto[];
}