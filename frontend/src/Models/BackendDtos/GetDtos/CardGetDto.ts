export type CardGetDto = {
    cardId: number;
    cardName: string;
    labels: { labelId: number }[];
}