import type {ChecklistItemGetDto} from "./ChecklistItemGetDto.ts";

export type ChecklistGetDto = {
    checklistId: number;
    position?: string;
    checklistName: string;
    checklistItems: ChecklistItemGetDto[];
}