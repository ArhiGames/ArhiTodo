export type DetailedCardGetDto = {
    cardId: number;
    cardName: string;
    labels: { labelId: number }[];
}