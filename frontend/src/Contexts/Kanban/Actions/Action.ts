import type { BoardGetDto } from "../../../Models/BackendDtos/GetDtos/BoardGetDto.ts";

export type InitBoardsPayload = {
    boardId: number;
    boardName: string;
}

export type InitBoardPayload = {
    boardId: number;
    boardGetDto: BoardGetDto;
}

export type CreateBoardPayload = {
    projectId: number;
    boardId: number;
    boardName: string;
}

export type CreateCardlistPayload = {
    projectId: number;
    boardId: number;
    cardListName: string;
}

export type Action =
    { type: "INIT_BOARDS", payload: InitBoardsPayload[] } |
    { type: "INIT_BOARD", payload: InitBoardPayload } |
    { type: "CREATE_BOARD_OPTIMISTIC", payload: CreateBoardPayload } |
    { type: "CREATE_BOARD_FAILED", payload: { failedBoardId: number } } |
    { type: "CREATE_CARDLIST_OPTIMISTIC", payload: CreateCardlistPayload }