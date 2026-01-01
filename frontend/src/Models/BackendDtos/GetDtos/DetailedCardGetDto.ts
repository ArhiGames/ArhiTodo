export type DetailedCardGetDto = {
    cardId: number;
    cardName: string;
    cardDescription: string;
    labels: { labelId: number }[];
}