import type {ChecklistItemGetDto} from "./ChecklistItemGetDto.ts";

export type ChecklistGetDto = {
    checklistId: number;
    checklistName: string;
    checklistItems: ChecklistItemGetDto[];
}