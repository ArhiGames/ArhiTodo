import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BoardHeader from "../Board/BoardHeader.tsx";
import BoardComp from "../Board/BoardComp.tsx";
import CreateNewBoardHeaderComp from "../Board/CreateNewBoardHeaderComp.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type { Board, State } from "../../Models/States/types.ts";
import { useKanbanDispatch, useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import {API_BASE_URL, HUB_BASE_URL} from "../../config/api.ts";
import * as signalR from "@microsoft/signalr";
import type {HubContextState} from "../../Contexts/Realtime/HubContextState.ts";
import {useRealtimeHub} from "../../Contexts/Realtime/Hooks.ts";
import {buildBoardConnection} from "../../Contexts/Realtime/ConnectionBuilders/BoardConnectionBuilder.ts";
import {buildCardListConnection} from "../../Contexts/Realtime/ConnectionBuilders/CardListConnectionBuilder.ts";
import {buildCardConnection} from "../../Contexts/Realtime/ConnectionBuilders/CardConnectionBuilder.ts";
import NoBoardComp from "../Board/NoBoardComp.tsx";

const ProjectViewComp = () => {

    const { token, checkRefresh } = useAuth();
    const { projectId, boardId } = useParams();
    const hubState: HubContextState = useRealtimeHub();
    const state: State = useKanbanState();
    const navigate = useNavigate();
    const dispatch = useKanbanDispatch();

    const projectIdNum: number = Number(projectId ?? 0);

    const [activeBoardId, setActiveBoardId] = useState<number | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function loadDefaultBoard() {

        if (!boardId && Object.keys(state.boards).length > 0) {
            let firstId: number = -1;
            for (const board of Object.values(state.boards)) {
                if (board.projectId === Number(projectId)) {
                    firstId = board.boardId;
                    break;
                }
            }
            if (firstId > 0) {
                setActiveBoardId(firstId);
                navigate(`/projects/${projectId}/board/${firstId}`, { replace: true });
            }
        }

    }

    useEffect(() => {

        const abortController = new AbortController();

        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            fetch(`${API_BASE_URL}/project/${projectId}/board`,
                {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${refreshedToken}` },
                    signal: abortController.signal
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch boards");
                    }

                    return res.json();
                })
                .then((fetchedBoards: Board[]) => {

                    if (dispatch) {
                        dispatch({ type: "INIT_BOARDS", payload: { projectId: Number(projectId), boards: fetchedBoards }});
                    }

                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        return;
                    }

                    console.error(err);
                });
        }

        run();

        return () => abortController.abort();

    }, [dispatch, projectId, checkRefresh]);

    useEffect(() => {

        if (!dispatch) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${HUB_BASE_URL}/board`, { accessTokenFactory: (): string | Promise<string> => token!})
            .withAutomaticReconnect()
            .build();

        buildBoardConnection(connection, dispatch);
        buildCardListConnection(connection, dispatch);
        buildCardConnection(connection, dispatch);

        const startConnection = async () => {

            connection.start()
                .then(() => {
                    console.log("Connected successfully to /hub/board/")
                    hubState.setHubConnection(connection);
                    connection.invoke("JoinProjectGroup", Number(projectId));
                })
                .catch(console.error);
        }

        startConnection();

        return () => {
            connection.stop()
                .then(() => {
                    console.log("Closed connection to /hub/board/ successfully")
                })
                .catch(console.error);
        }

    }, [dispatch, token, projectId]);

    useEffect(() => {
        loadDefaultBoard();
    }, [loadDefaultBoard, state.boards]);

    useEffect(() => {
        if (boardId) {
            setActiveBoardId(Number(boardId));
        }
    }, [boardId]);

    return (
        <div className="project-view">
            <div className="board-selectors">
                {Object.values(state.boards).map((board: Board) => {
                    return (
                        board.projectId === projectIdNum ?
                            <BoardHeader isSelected={board.boardId === Number(boardId)} key={board.boardId} projectId={projectIdNum} board={board}/> : null
                    )
                })}
                <CreateNewBoardHeaderComp/>
            </div>
            { activeBoardId ? <BoardComp projectId={projectIdNum} boardId={activeBoardId}/> : <NoBoardComp/> }

        </div>
    )
}

export default ProjectViewComp;