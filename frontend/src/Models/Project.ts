import type { Board } from "./Board.ts";

export interface Project {
    projectId: number;
    projectName: string;
    boards: Board[];
}