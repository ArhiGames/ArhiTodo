import type {HubConnection} from "@microsoft/signalr";
import type {BoardGetDto} from "../../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import type {Dispatch} from "react";
import type {KanbanAction} from "../../Kanban/Actions/KanbanAction.ts";

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
}