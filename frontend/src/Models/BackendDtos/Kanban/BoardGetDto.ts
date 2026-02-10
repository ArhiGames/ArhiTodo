import type { CardListGetDto } from "./CardListGetDto.ts";
import type {LabelGetDto} from "./LabelGetDto.ts";

export type BoardGetDto = {
    boardId: number;
    boardName: string;
    ownedByUserId: string;
    cardLists: CardListGetDto[];
    labels: LabelGetDto[];
}