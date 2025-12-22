export type InitBoardPayload = {
    boardId: number;
    boardName: string;
}

export type CreateBoardPayload = {
    projectId: number;
    boardId: number;
    boardName: string;
}

export type Action =
    { type: "INIT_BOARDS", payload: InitBoardPayload[] } |
    { type: "CREATE_BOARD_OPTIMISTIC", payload: CreateBoardPayload } |
    { type: "CREATE_BOARD_FAILED", payload: { failedBoardId: number } }