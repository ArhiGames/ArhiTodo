import type { BoardGetDto } from "../../../Models/BackendDtos/GetDtos/BoardGetDto.ts";
import type { LabelGetDto } from "../../../Models/BackendDtos/GetDtos/LabelGetDto.ts";

export type InitBoardsPayload = {
    boardId: number;
    boardName: string;
}

export type InitBoardPayload = {
    boardId: number;
    boardGetDto: BoardGetDto;
    labels: LabelGetDto[];
}

export type CreateBoardPayload = {
    projectId: number;
    boardId: number;
    boardName: string;
}

export type CreateBoardSucceededPayload = {
    predictedBoardId: number;
    actualBoardId: number;
}

export type UpdateBoardPayload = {
    boardId: number;
    boardName: string;
}

export type CreateCardlistPayload = {
    boardId: number;
    cardListId: number;
    cardListName: string;
}

export type CreateCardlistSucceededPayload = {
    predictedCardlistId: number;
    actualCardlistId: number;
}

export type CreateCardPayload = {
    cardListId: number;
    cardId: number;
    cardName: string;
}

export type CreateCardSucceededPayload = {
    predictedCardId: number;
    actualCardId: number;
}

export type Action =
    { type: "INIT_BOARDS", payload: { projectId: number, boards: InitBoardsPayload[] }} |
    { type: "INIT_BOARD", payload: InitBoardPayload } |

    { type: "CREATE_BOARD_OPTIMISTIC", payload: CreateBoardPayload } |
    { type: "CREATE_BOARD_SUCCEEDED", payload: CreateBoardSucceededPayload } |
    { type: "CREATE_BOARD_FAILED", payload: { failedBoardId: number } } |

    { type: "UPDATE_BOARD", payload: UpdateBoardPayload } |
    { type: "DELETE_BOARD", payload: { boardId: number } } |

    { type: "CREATE_CARDLIST_OPTIMISTIC", payload: CreateCardlistPayload } |
    { type: "CREATE_CARDLIST_SUCCEEDED", payload: CreateCardlistSucceededPayload } |
    { type: "CREATE_CARDLIST_FAILED", payload: { failedCardlistId: number } } |

    { type: "CREATE_CARD_OPTIMISTIC", payload: CreateCardPayload } |
    { type: "CREATE_CARD_SUCCEEDED", payload: CreateCardSucceededPayload } |
    { type: "CREATE_CARD_FAILED", payload: { failedCardId: number } }