import type {ChecklistGetDto} from "./ChecklistGetDto.ts";

export type DetailedCardGetDto = {
    cardId: number;
    isDone: boolean;
    cardName: string;
    cardDescription: string;
    labels: number[];
    checklists: ChecklistGetDto[];
}