export type CardGetDto = {
    cardId: number;
    isDone: boolean;
    cardName: string;
    labels: { labelId: number }[];
}