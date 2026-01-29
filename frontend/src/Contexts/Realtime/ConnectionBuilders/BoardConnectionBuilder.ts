import type {HubConnection} from "@microsoft/signalr";
import type {BoardGetDto} from "../../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import type {Dispatch} from "react";
import type {Action} from "../../Kanban/Actions/Action.ts";

export function buildBoardConnection(hubConnection: HubConnection, dispatch: Dispatch<Action>) {
    hubConnection.on("CreateBoard", (projectId: number, board: BoardGetDto) => {
        dispatch({
            type: "CREATE_BOARD_OPTIMISTIC",
            payload: { projectId: projectId, boardId: board.boardId, boardName: board.boardName }
        });
    });

    hubConnection.on("UpdateBoard", (_projectId: number, board: BoardGetDto) => {
        dispatch({ type: "UPDATE_BOARD", payload: { boardId: board.boardId, boardName: board.boardName } });
    });

    hubConnection.on("DeleteBoard", (boardId: number) => {
        dispatch({ type: "DELETE_BOARD", payload: { boardId: boardId } });
    });
}