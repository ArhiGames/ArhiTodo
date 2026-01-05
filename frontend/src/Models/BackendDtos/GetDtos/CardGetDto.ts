export type CardGetDto = {
    cardId: number;
    cardName: string;
    isDone: boolean;
    totalTasks: number;
    totalTasksCompleted: number;
    labels: { labelId: number }[];
}