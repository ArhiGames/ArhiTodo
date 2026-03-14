import { useEffect, useState } from "react";
import BoardComp from "../Board/BoardComp/BoardComp.tsx";
import CreateNewBoardHeaderComp from "../Board/CreateNewBoardHeaderComp.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type {Board, KanbanState, Project, PublicUserGetDto} from "../../Models/States/KanbanState.ts";
import { useKanbanDispatch, useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import {API_BASE_URL, HUB_BASE_URL} from "../../config/api.ts";
import * as signalR from "@microsoft/signalr";
import type {HubContextState} from "../../Contexts/Realtime/HubContextState.ts";
import {useRealtimeHub} from "../../Contexts/Realtime/Hooks.ts";
import {buildBoardConnection} from "../../Contexts/Realtime/ConnectionBuilders/BoardConnectionBuilder.ts";
import {buildCardListConnection} from "../../Contexts/Realtime/ConnectionBuilders/CardListConnectionBuilder.ts";
import {buildCardConnection} from "../../Contexts/Realtime/ConnectionBuilders/CardConnectionBuilder.ts";
import NoBoardComp from "../Board/BoardComp/NoBoardComp.tsx";
import {buildChecklistConnection} from "../../Contexts/Realtime/ConnectionBuilders/ChecklistConnectionBuilder.ts";
import {buildLabelConnection} from "../../Contexts/Realtime/ConnectionBuilders/LabelConnectionBuilder.ts";
import type {ProjectGetDto} from "../../Models/BackendDtos/Kanban/ProjectGetDto.ts";
import {useNavigate, useParams} from "react-router-dom";
import {buildProjectConnection} from "../../Contexts/Realtime/ConnectionBuilders/ProjectConnectionBuilder.ts";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import type {Claim} from "../../Models/Claim.ts";
import BoardHeaderWrapper from "../Board/BoardHeaderWrapper.tsx";
import SearchCardsContextProvider from "../../Contexts/Kanban/Cards/SearchCardsContextProvider.tsx";

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
                    dispatch({ type: "INIT_BOARDS", payload: { projectId: Number(projectId), boards: fetchedBoards }});
                }
            })
            .catch(err => {
                navigate("/");
                console.error(err);
            })
            .finally(() => {
                if (!hasLoadedBoards) setHasLoadedBoards(true)
            });
    }

    useEffect(() => {
        if (!hasLoadedProject) return;
        if (!kanbanState.projects.has(Number(projectId))) {
            navigate("/");
        }
    }, [navigate, projectId, kanbanState.projects, hasLoadedProject]);

    useEffect(() => {

        let newTitle = "";

        const project: Project | undefined = kanbanState.projects.get(Number(projectId));
        if (project) newTitle += project.projectName

        const board: Board | undefined = kanbanState.boards.get(Number(boardId));
        if (board) newTitle += ` - ${board.boardName}`

        document.title = newTitle;

        return () => {
            document.title = "ArhiTodo"
        }
    }, [projectId, boardId, kanbanState.projects, kanbanState.boards]);

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
                .catch(err => {
                    navigate("/");
                    console.error(err);
                })
                .finally(() => setHasLoadedProject(true))

            fetch(`${API_BASE_URL}/project/${projectId}/managers/public`, {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch project");
                    }

                    return res.json();
                })
                .then((projectManagers: PublicUserGetDto[]) => {
                    if (dispatch) {
                        dispatch({ type: "INIT_PROJECT_MANAGERS", payload: { projectId: Number(projectId), projectManagers: projectManagers } });
                    }
                })

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

        connection.on("AddProjectManager", async (projectId: number, projectManager: PublicUserGetDto) => {
            if (projectManager.userId === appUser?.id) {
                await loadBoards()
            }
            dispatch({ type: "ADD_PROJECT_MANAGER", payload: { projectId: projectId, projectManager: projectManager } });

            if (!permissions.userDispatch || projectManager.userId !== appUser?.id) return;
            const isOwner: boolean = kanbanState.projects.get(Number(projectId))?.ownedByUserId === appUser?.id;
            permissions.userDispatch({
                type: "SET_PROJECT_PERMISSION",
                payload: { projectId: Number(projectId), isManager: true, isOwner }
            });
        });

        connection.on("RemoveProjectManager", async (projectId: number, projectManagerId: string) => {
            if (projectManagerId === appUser?.id) {
                await loadBoards()
            }
            dispatch({ type: "REMOVE_PROJECT_MANAGER", payload: { projectId: projectId, projectManagerId: projectManagerId } });

            if (!permissions.userDispatch || projectManagerId !== appUser?.id) return;
            const isOwner: boolean = kanbanState.projects.get(Number(projectId))?.ownedByUserId === appUser?.id;
            permissions.userDispatch({
                type: "SET_PROJECT_PERMISSION",
                payload: { projectId: Number(projectId), isManager: false, isOwner }
            });
        })

        connection.on("UpdateUserBoardPermissions", async (boardId: number, claims: Claim[]) => {
            await loadBoards();
            if (!permissions.userDispatch) return;

            const isOwner: boolean = kanbanState.boards.get(Number(boardId))?.ownedByUserId === appUser?.id;
            permissions.userDispatch({
                type: "SET_BOARD_PERMISSION",
                payload: { boardId: boardId, boardUserClaims: claims, isOwner }
            })
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

        startConnection().catch(console.error);

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
    }, [hasLoadedBoards, loadDefaultBoard]);

    useEffect(() => {
        if (boardId) {
            setActiveBoardId(Number(boardId));
        }
    }, [boardId]);

    return (
        <SearchCardsContextProvider>
            <div className="project-view">
                <div className="board-selectors scroller">
                    {kanbanState.projects.get(Number(projectId))?.boardIds
                        .map((boardId: number, index: number) => {
                            return <BoardHeaderWrapper boardId={boardId} dndIndex={index} key={boardId}/>
                        })}
                    { permissions.hasCreateBoardPermission() && <CreateNewBoardHeaderComp/> }
                </div>
                { activeBoardId && hasLoadedBoards ? <BoardComp/> : <NoBoardComp/> }
            </div>
        </SearchCardsContextProvider>
    )
}

export default ProjectViewComp;