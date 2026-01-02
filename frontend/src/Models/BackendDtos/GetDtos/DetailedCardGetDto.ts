export type DetailedCardGetDto = {
    cardId: number;
    isDone: boolean;
    cardName: string;
    cardDescription: string;
    labels: { labelId: number }[];
}