import type { BoardGetDto } from "./BoardGetDto.ts";

export type ProjectGetDto = {
    projectId: number;
    projectName: string;
    boards: BoardGetDto[];
}