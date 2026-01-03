import type {BoardGetDto} from "./BackendDtos/GetDtos/BoardGetDto.ts";

export interface Project {
    projectId: number;
    projectName: string;
    boards: BoardGetDto[];
}