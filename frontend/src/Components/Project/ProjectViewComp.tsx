import { useEffect, useState } from "react";
import BoardHeader from "../Board/BoardHeader.tsx";
import BoardComp from "../Board/BoardComp.tsx";
import CreateNewBoardHeaderComp from "../Board/CreateNewBoardHeaderComp.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type {Board, State} from "../../Models/States/types.ts";
import { useKanbanDispatch, useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import {API_BASE_URL, HUB_BASE_URL} from "../../config/api.ts";
import * as signalR from "@microsoft/signalr";
import type {HubContextState} from "../../Contexts/Realtime/HubContextState.ts";
import {useRealtimeHub} from "../../Contexts/Realtime/Hooks.ts";
import {buildBoardConnection} from "../../Contexts/Realtime/ConnectionBuilders/BoardConnectionBuilder.ts";
import {buildCardListConnection} from "../../Contexts/Realtime/ConnectionBuilders/CardListConnectionBuilder.ts";
import {buildCardConnection} from "../../Contexts/Realtime/ConnectionBuilders/CardConnectionBuilder.ts";
import NoBoardComp from "../Board/NoBoardComp.tsx";
import {buildChecklistConnection} from "../../Contexts/Realtime/ConnectionBuilders/ChecklistConnectionBuilder.ts";
import {buildLabelConnection} from "../../Contexts/Realtime/ConnectionBuilders/LabelConnectionBuilder.ts";
import type {ProjectGetDto} from "../../Models/BackendDtos/Kanban/ProjectGetDto.ts";
import {useNavigate, useParams} from "react-router-dom";
import {buildProjectConnection} from "../../Contexts/Realtime/ConnectionBuilders/ProjectConnectionBuilder.ts";

const ProjectViewComp = () => {

    const { jwtPayload, token, checkRefresh } = useAuth();
    const { projectId, boardId } = useParams();
    const hubState: HubContextState = useRealtimeHub();
    const kanbanState: State = useKanbanState();
    const navigate = useNavigate();
    const dispatch = useKanbanDispatch();

    const [activeBoardId, setActiveBoardId] = useState<number | null>(null);
    const [hasLoadedProject, setHasLoadedProject] = useState<boolean>(false);
    const [hasLoadedBoards, setHasLoadedBoards] = useState<boolean>(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function loadDefaultBoard() {

        if (!boardId && Object.keys(kanbanState.boards).length > 0) {
            let firstId: number = -1;
            for (const board of Object.values(kanbanState.boards)) {
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

    function hasCreateBoardPermission(): boolean {
        const hasPermissionGlobally = jwtPayload?.ModifyOthersProjects === "true";
        const isProjectManager = kanbanState.projectPermission[Number(projectId)]?.isManager;
        return hasPermissionGlobally || isProjectManager;
    }

    useEffect(() => {
        if (!hasLoadedProject) return;
        if (!kanbanState.projects[Number(projectId)]) {
            navigate("/");
        }
    }, [navigate, projectId, kanbanState.projects, hasLoadedProject]);

    useEffect(() => {

        const abortController = new AbortController();

        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            await fetch(`${API_BASE_URL}/project/${projectId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch project");
                    }

                    return res.json();
                })
                .then((projectGetDto: ProjectGetDto) => {
                    if (dispatch) {
                        dispatch({type: "INIT_PROJECT", payload: projectGetDto});
                    }
                })
                .finally(() => setHasLoadedProject(true))

            fetch(`${API_BASE_URL}/project/${projectId}/permissions`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch project permissions");
                    }

                    return res.json();
                })
                .then((projectPermission: { isManager: boolean }) => {
                    if (dispatch) {
                        dispatch({type: "SET_PROJECT_PERMISSION", payload: { projectId: Number(projectId), isManager: projectPermission.isManager }});
                    }
                })
                .catch(console.error);

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
                        dispatch({ type: "INIT_BOARDS", payload: { projectId: Number(projectId), boards: fetchedBoards }});}

                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        return;
                    }

                    console.error(err);
                })
                .finally(() => setHasLoadedBoards(true));
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

        buildProjectConnection(connection, dispatch);
        buildBoardConnection(connection, dispatch);
        buildCardListConnection(connection, dispatch);
        buildCardConnection(connection, dispatch);
        buildChecklistConnection(connection, dispatch);
        buildLabelConnection(connection, dispatch);

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
        if (hasLoadedBoards) {
            loadDefaultBoard();
        }
    }, [hasLoadedBoards, loadDefaultBoard, kanbanState.boards]);

    useEffect(() => {
        if (boardId) {
            setActiveBoardId(Number(boardId));
        }
    }, [boardId]);

    return (
        <div className="project-view">
            <div className="board-selectors">
                {Object.values(kanbanState.boards).map((board: Board) => {
                    return (
                        board.projectId === Number(projectId) ?
                            <BoardHeader isSelected={board.boardId === Number(boardId)} key={board.boardId} projectId={Number(projectId)} board={board}/> : null
                    )
                })}
                { hasCreateBoardPermission() && <CreateNewBoardHeaderComp/> }
            </div>
            { activeBoardId && hasLoadedBoards ? <BoardComp projectId={Number(projectId)} boardId={activeBoardId}/> : <NoBoardComp/> }

        </div>
    )
}

export default ProjectViewComp;