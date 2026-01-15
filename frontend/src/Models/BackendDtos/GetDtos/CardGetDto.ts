import type {ChecklistGetDto} from "./ChecklistGetDto.ts";

export type CardGetDto = {
    cardId: number;
    cardName: string;
    isDone: boolean;
    labelIds: number[];
    checklists: ChecklistGetDto[];
}