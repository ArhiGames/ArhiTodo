import {type Dispatch, useEffect, useState} from "react"
import CardListComp from "../CardList/CardListComp.tsx";
import CreateNewCardListComp from "../CardList/CreateNewCardListComp.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type {Action} from "../../Contexts/Kanban/Actions/Action.ts";
import type {BoardGetDto} from "../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import type {PublicUserGetDto, CardList, State} from "../../Models/States/types.ts";
import {useNavigate, useParams} from "react-router-dom";
import {createPortal} from "react-dom";
import ViewCardDetailsComp from "../Card/Detailed/ViewCardDetailsComp.tsx";
import {API_BASE_URL} from "../../config/api.ts";
import type {HubContextState} from "../../Contexts/Realtime/HubContextState.ts";
import {useRealtimeHub} from "../../Contexts/Realtime/Hooks.ts";
import BoardCompHeader from "./BoardCompHeader.tsx";
import "./Board.css"
import type {Claim} from "../../Models/Claim.ts";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import {HubConnectionState} from "@microsoft/signalr";

const BoardComp = () => {

    const { checkRefresh } = useAuth();
    const { projectId, boardId, cardId } = useParams();
    const navigate = useNavigate();
    const hubState: HubContextState = useRealtimeHub();
    const dispatch: Dispatch<Action> | undefined = useKanbanDispatch();
    const kanbanState: State = useKanbanState();
    const permissions = usePermissions();

    const [currentFilteringLabels, setCurrentFilteringLabels] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (!kanbanState.boards.get(Number(boardId))) {
            navigate(`/projects/${Number(projectId)}/board/`);
        }
    }, [boardId, kanbanState.boards, projectId, navigate]);

    useEffect(() => {

        if (boardId == null) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentFilteringLabels([]);

        const abortController = new AbortController();
        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            await fetch(`${API_BASE_URL}/project/${Number(projectId)}/board/${Number(boardId)}`,
                {
                    method: 'GET',
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
                    signal: abortController.signal
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Could not fetch /api/cards/project/${Number(projectId)}/board/${Number(boardId)}: ${res.type}`)
                    }

                    return res.json()
                })
                .then((boardGetDto: BoardGetDto) => {
                    if (dispatch) {
                        dispatch({ type: "INIT_BOARD", payload: { boardId: boardGetDto.boardId, boardGetDto: boardGetDto }});
                    }
                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        return;
                    }

                    navigate(`/projects/${Number(projectId)}/board/`);
                    console.error(err);
                });

            await fetch(`${API_BASE_URL}/project/${Number(projectId)}/board/${Number(boardId)}/permissions`, {
                method: 'GET',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Could not fetch board permissions!");
                    }

                    return res.json();
                })
                .then((boardUserClaims: Claim[]) => {
                    if (dispatch) {
                        dispatch({ type: "SET_BOARD_PERMISSION", payload: { boardId: Number(boardId), boardUserClaims: boardUserClaims } });
                    }
                })
                .catch(console.error);

            await fetch(`${API_BASE_URL}/board/${boardId}/members/public`, {
                method: 'GET',
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Could not fetch board members!");
                    }

                    return res.json();
                })
                .then((members: PublicUserGetDto[]) => {
                    if (dispatch) {
                        dispatch({
                            type: "INIT_BOARD_MEMBERS",
                            payload: {boardId: Number(boardId), boardMembers: members}
                        });
                    }
                })
                .catch(console.error);

            setIsLoaded(true);
        }

        run();

        return () => abortController.abort();

    }, [projectId, boardId, checkRefresh, dispatch, navigate]);

    useEffect(() => {

        if (!hubState.hubConnection) return;

        if (hubState.hubConnection.state !== HubConnectionState.Connected) return;

        hubState.hubConnection.invoke("JoinBoardGroup", Number(boardId))
            .then(() => console.log(`Joined board group with id: ${Number(boardId)}`))
            .catch(console.error);

    }, [dispatch, hubState.hubConnection, boardId]);

    return (
        <div className="board-body">
            <BoardCompHeader currentFilteringLabels={currentFilteringLabels} setCurrentFilteringLabels={setCurrentFilteringLabels}/>
            {
                isLoaded && (
                    <>
                        <div className="board-content scroller">
                            {
                                <>
                                    {Array.from(kanbanState.cardLists.values())
                                        .filter((cardList: CardList) => cardList.boardId === Number(boardId))
                                        .map((cardList: CardList) => {
                                            return <CardListComp cardListId={cardList.cardListId} filteringLabels={currentFilteringLabels}
                                                                 key={cardList.cardListId}/>;
                                        })}
                                    { permissions.hasManageCardListsPermission() && <CreateNewCardListComp/> }
                                </>
                            }
                        </div>
                        { cardId !== undefined && createPortal(<ViewCardDetailsComp/>, document.body) }
                    </>
                )
            }

        </div>
    )
}

export default BoardComp;