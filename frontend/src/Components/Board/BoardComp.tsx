import {type Dispatch, useEffect, useState} from "react"
import type { CardListGetDto } from "../../Models/BackendDtos/Kanban/CardListGetDto.ts";
import CardListComp from "../CardList/CardListComp.tsx";
import CreateNewCardListComp from "../CardList/CreateNewCardListComp.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import { useKanbanDispatch, useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import type { Action } from "../../Contexts/Kanban/Actions/Action.ts";
import type { BoardGetDto } from "../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import type {Board, CardList, State} from "../../Models/States/types.ts";
import {useNavigate, useParams} from "react-router-dom";
import {createPortal} from "react-dom";
import ViewCardDetailsComp from "../Card/Detailed/ViewCardDetailsComp.tsx";
import {API_BASE_URL} from "../../config/api.ts";
import type {HubContextState} from "../../Contexts/Realtime/HubContextState.ts";
import {useRealtimeHub} from "../../Contexts/Realtime/Hooks.ts";
import BoardCompHeader from "./BoardCompHeader.tsx";
import "./Board.css"
import type {LabelGetDto} from "../../Models/BackendDtos/Kanban/LabelGetDto.ts";
import type {Claim} from "../../Models/Claim.ts";

const BoardComp = (props: { projectId: number, boardId: number }) => {

    const { checkRefresh } = useAuth();
    const { cardId } = useParams();
    const navigate = useNavigate();
    const hubState: HubContextState = useRealtimeHub();
    const dispatch: Dispatch<Action> | undefined = useKanbanDispatch();
    const kanbanState: State = useKanbanState();

    const board: BoardGetDto = getUnnormalizedKanbanState();

    const [currentFilteringLabels, setCurrentFilteringLabels] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    function getUnnormalizedKanbanState() {

        let boardName: string = "";
        let ownedByUserId: string = "";
        for (let i = 0; i < Object.values(kanbanState.boards).length; i++) {
            const board: Board = Object.values(kanbanState.boards)[i];
            if (board.boardId === props.boardId) {
                boardName = board.boardName;
                ownedByUserId = board.ownedByUserId;
                break;
            }
        }

        const labels: LabelGetDto[] = [];
        for (let i = 0; i < Object.values(kanbanState.labels).length; i++) {
            const label = Object.values(kanbanState.labels)[i];
            if (label.boardId === props.boardId) {
                labels.push({
                    labelId: label.labelId,
                    labelText: label.labelText,
                    labelColor: label.labelColor
                })
            }
        }

        const cardLists: CardListGetDto[] = [];
        if (kanbanState.cardLists) {
            for (let i = 0; i < Object.values(kanbanState.cardLists).length; i++) {
                const list: CardList = Object.values(kanbanState.cardLists)[i];
                if (list.boardId === props.boardId) {
                    cardLists.push({
                        cardListId: list.cardListId,
                        cardListName: list.cardListName,
                        cards: []
                    })
                }
            }
        }

        const boardGetDto: BoardGetDto = {
            boardId: props.boardId,
            boardName: boardName,
            ownedByUserId: ownedByUserId,
            cardLists: cardLists,
            labels: labels,
        }

        return boardGetDto;
    }

    useEffect(() => {
        if (!kanbanState.boards[props.boardId]) {
            navigate(`/projects/${props.projectId}/board/`);
        }
    }, [props.boardId, kanbanState.boards, props.projectId, navigate]);

    useEffect(() => {

        if (props.boardId == null) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentFilteringLabels([]);

        const abortController = new AbortController();
        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            await fetch(`${API_BASE_URL}/project/${props.projectId}/board/${props.boardId}`,
                {
                    method: 'GET',
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
                    signal: abortController.signal
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Could not fetch /api/cards/project/${props.projectId}/board/${props.boardId}: ${res.type}`)
                    }

                    return res.json()
                })
                .then((boardGetDto: BoardGetDto) => {

                    if (dispatch) {
                        dispatch({ type: "INIT_BOARD", payload: { boardId: boardGetDto.boardId, boardGetDto: boardGetDto }});
                    }
                    setIsLoaded(true);

                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        return;
                    }

                    navigate(`/projects/${props.projectId}/board/`);
                    console.error(err);
                });

            await fetch(`${API_BASE_URL}/project/${props.projectId}/board/${props.boardId}/permissions`, {
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
                        dispatch({ type: "SET_BOARD_PERMISSION", payload: { boardId: props.boardId, boardUserClaims: boardUserClaims } });
                    }
                })
                .catch(console.error);
        }

        run();

        return () => abortController.abort();

    }, [props.projectId, props.boardId, checkRefresh, dispatch, navigate]);

    useEffect(() => {

        if (!hubState.hubConnection) return;

        if (hubState.hubConnection.state !== "Connected") return;

        hubState.hubConnection.invoke("JoinBoardGroup", props.boardId)
            .then(() => console.log(`Joined board group with id: ${props.boardId}`))
            .catch(console.error);

    }, [dispatch, hubState.hubConnection, props.boardId]);

    return (
        <div className="board-body">
            <BoardCompHeader currentFilteringLabels={currentFilteringLabels} setCurrentFilteringLabels={setCurrentFilteringLabels}/>
            {
                isLoaded && (
                    <>
                        <div className="board-content scroller">
                            {
                                board ? (
                                    <>
                                        { (board.cardLists && board.cardLists.length > 0) && (
                                            board.cardLists.map((cardList: CardListGetDto) => {
                                                return (
                                                    <CardListComp boardId={props.boardId!} cardList={cardList}
                                                                  filteringLabels={currentFilteringLabels} key={cardList.cardListId}/>
                                                );
                                            }))}
                                        <CreateNewCardListComp/>
                                    </>
                                ) : (
                                    <p>Loading...</p>
                                )
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