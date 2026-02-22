import type {HubConnection} from "@microsoft/signalr";
import type {BoardGetDto} from "../../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import type {Dispatch} from "react";
import type {KanbanAction} from "../../Kanban/Actions/KanbanAction.ts";
import type {PublicUserGetDto} from "../../../Models/States/KanbanState.ts";

export function buildBoardConnection(hubConnection: HubConnection, dispatch: Dispatch<KanbanAction>) {
    hubConnection.on("CreateBoard", (projectId: number, board: BoardGetDto) => {
        dispatch({
            type: "CREATE_BOARD_OPTIMISTIC",
            payload: { projectId: projectId, boardId: board.boardId, boardName: board.boardName, ownedByUserId: board.ownedByUserId }
        });
    });

    hubConnection.on("UpdateBoard", (_projectId: number, board: BoardGetDto) => {
        dispatch({ type: "UPDATE_BOARD", payload: { boardId: board.boardId, boardName: board.boardName } });
    });

    hubConnection.on("DeleteBoard", (boardId: number) => {
        dispatch({ type: "DELETE_BOARD", payload: { boardId: boardId } });
    });

    hubConnection.on("AddBoardMember", (boardId: number, publicUserGetDto: PublicUserGetDto) => {
        dispatch({ type: "ADD_BOARD_MEMBER", payload: { boardId: boardId, boardMember: publicUserGetDto } });
    });

    hubConnection.on("RemoveBoardMember", (boardId: number, userId: string) => {
        dispatch({ type: "REMOVE_BOARD_MEMBER", payload: { boardId: boardId, boardMemberId: userId } });
    });
}