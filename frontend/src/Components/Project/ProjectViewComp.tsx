import { useEffect, useState } from "react";
import BoardHeader from "../Board/BoardHeader.tsx";
import BoardComp from "../Board/BoardComp.tsx";
import CreateNewBoardHeaderComp from "../Board/CreateNewBoardHeaderComp.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type {Board, KanbanState} from "../../Models/States/KanbanState.ts";
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
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import type {Claim} from "../../Models/Claim.ts";

const ProjectViewComp = () => {

    const { token, checkRefresh, appUser } = useAuth();
    const { projectId, boardId } = useParams();
    const hubState: HubContextState = useRealtimeHub();
    const kanbanState: KanbanState = useKanbanState();
    const permissions = usePermissions();
    const navigate = useNavigate();
    const dispatch = useKanbanDispatch();

    const [activeBoardId, setActiveBoardId] = useState<number | null>(null);
    const [hasLoadedProject, setHasLoadedProject] = useState<boolean>(false);
    const [hasLoadedBoards, setHasLoadedBoards] = useState<boolean>(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function loadDefaultBoard() {

        if (!boardId && kanbanState.boards.size > 0) {
            let firstId: number = -1;
            for (const board of kanbanState.boards.values()) {
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

    async function loadBoards() {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${projectId}/board`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
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

    useEffect(() => {
        if (!hasLoadedProject) return;
        if (!kanbanState.projects.has(Number(projectId))) {
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
                    if (permissions.userDispatch) {
                        const isOwner: boolean = kanbanState.projects.get(Number(projectId))?.ownedByUserId === appUser?.id;
                        permissions.userDispatch({
                            type: "SET_PROJECT_PERMISSION",
                            payload: { projectId: Number(projectId), isManager: projectPermission.isManager, isOwner }
                        });
                    }
                })
                .catch(console.error);

            await loadBoards();
        }

        run();

        return () => abortController.abort();

    }, []);

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

        connection.on("UpdateProjectManager", (projectId: number, isManager: boolean) => {
            loadBoards();
            if (permissions.userDispatch) {
                const isOwner: boolean = kanbanState.projects.get(Number(projectId))?.ownedByUserId === appUser?.id;
                permissions.userDispatch({
                    type: "SET_PROJECT_PERMISSION",
                    payload: { projectId: Number(projectId), isManager: isManager, isOwner }
                });
            }
        })
        connection.on("UpdateUserBoardPermissions", (boardId: number, claims: Claim[]) => {
            loadBoards();
            if (permissions.userDispatch) {
                const isOwner: boolean = kanbanState.boards.get(Number(boardId))?.ownedByUserId === appUser?.id;
                permissions.userDispatch({
                    type: "SET_BOARD_PERMISSION",
                    payload: { boardId: boardId, boardUserClaims: claims, isOwner }
                })
            }
        });

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

    }, []);

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
                {Array.from(kanbanState.boards.values())
                    .filter(b => b.projectId === Number(projectId))
                    .map((board: Board, index: number) => {
                    return <BoardHeader isSelected={board.boardId === Number(boardId)} dndIndex={index}
                                        key={board.boardId} projectId={Number(projectId)} board={board}/>
                })}
                { permissions.hasCreateBoardPermission() && <CreateNewBoardHeaderComp/> }
            </div>
            { activeBoardId && hasLoadedBoards ? <BoardComp/> : <NoBoardComp/> }

        </div>
    )
}

export default ProjectViewComp;