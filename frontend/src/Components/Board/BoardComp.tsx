import {type Dispatch, useEffect, useRef, useState} from "react"
import type { CardListGetDto } from "../../Models/BackendDtos/GetDtos/CardListGetDto.ts";
import CardListComp from "../CardList/CardListComp.tsx";
import CreateNewCardListComp from "../CardList/CreateNewCardListComp.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import { useKanbanDispatch, useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import type { Action } from "../../Contexts/Kanban/Actions/Action.ts";
import type { BoardGetDto } from "../../Models/BackendDtos/GetDtos/BoardGetDto.ts";
import type {Board, CardList, Label, State} from "../../Models/States/types.ts";
import type {LabelGetDto} from "../../Models/BackendDtos/GetDtos/LabelGetDto.ts";
import LabelSelector from "../Labels/LabelSelector.tsx";
import {type Rgb, toRgb} from "../../lib/Functions.ts";
import {useNavigate, useParams} from "react-router-dom";
import {createPortal} from "react-dom";
import ViewCardDetailsComp from "../Card/Detailed/ViewCardDetailsComp.tsx";
import {API_BASE_URL} from "../../config/api.ts";
import type {HubContextState} from "../../Contexts/Realtime/HubContextState.ts";
import {useRealtimeHub} from "../../Contexts/Realtime/Hooks.ts";

const BoardComp = (props: { projectId: number, boardId: number | null }) => {

    const { token, checkRefresh } = useAuth();
    const { cardId } = useParams();
    const navigate = useNavigate();
    const hubState: HubContextState = useRealtimeHub();
    const dispatch: Dispatch<Action> | undefined = useKanbanDispatch();
    const kanbanState: State = useKanbanState();
    const board: BoardGetDto | null = getUnnormalizedKanbanState()
    const seeLabelsButtonRef = useRef<HTMLElement | null>(null);
    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);
    const [currentFilteringLabels, setCurrentFilteringLabels] = useState<number[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    function getUnnormalizedKanbanState() {
        if (props.boardId == null) return null;

        let boardName: string = "";
        for (let i = 0; i < Object.values(kanbanState.boards).length; i++) {
            const board: Board = Object.values(kanbanState.boards)[i];
            if (board.boardId === props.boardId) {
                boardName = board.boardName;
                break;
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
            cardLists: cardLists
        }

        return boardGetDto;
    }

    function onFilteringLabelSelected(label: Label) {
        setCurrentFilteringLabels(labels => [...labels, label.labelId]);
    }

    function onFilteringLabelUnselected(label: Label) {
        setCurrentFilteringLabels(currentFilteringLabels.filter(labelId => labelId !== label.labelId));
    }

    function startEditingLabels(onTarget: HTMLElement) {
        seeLabelsButtonRef.current = onTarget;
        setIsEditingLabels(true);
    }

    function getLabelJsxFor(labelId: number) {
        const label: Label = kanbanState.labels[labelId];
        const rgb: Rgb = toRgb(label.labelColor);
        return (
            <div key={labelId} onClick={(e) => startEditingLabels(e.currentTarget)}
                 className="board-label"
                 style={{ backgroundColor: `rgb(${rgb.red},${rgb.green},${rgb.blue})` }}>
                <p>{label.labelText}</p>
            </div>
        )
    }

    useEffect(() => {

        if (props.boardId == null) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentFilteringLabels([]);

        const abortController = new AbortController();
        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            fetch(`${API_BASE_URL}/project/${props.projectId}/board/${props.boardId}`,
                {
                    method: 'GET',
                    headers: { "Authorization": `Bearer ${refreshedToken}` },
                    signal: abortController.signal
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Could not fetch /api/cards/project/${props.projectId}/board/${props.boardId}: ${res.type}`)
                    }

                    return res.json()
                })
                .then((res: { board: BoardGetDto; labels: LabelGetDto[] }) => {

                    if (dispatch) {
                        dispatch({type: "INIT_BOARD", payload: { boardId: res.board.boardId, boardGetDto: res.board, labels: res.labels }});
                    }
                    setLoaded(true);

                })
                .catch(err => {
                    if (err.name === "AbortError") {
                        return;
                    }

                    navigate("/");
                    console.error(err);
                })
        }

        run();

        return () => abortController.abort();

    }, [props.projectId, props.boardId, token, dispatch, checkRefresh, navigate]);

    useEffect(() => {

        if (!hubState.hubConnection) return;

        if (hubState.hubConnection.state !== "Connected") return;

        hubState.hubConnection.invoke("JoinBoardGroup", props.boardId)
            .then(() => console.log(`Joined board group with id: ${props.boardId}`))
            .catch(console.error);

        hubState.hubConnection.on("CreateBoard", (projectId: number, board: BoardGetDto) => {
            if (dispatch) {
                dispatch({
                    type: "CREATE_BOARD_OPTIMISTIC",
                    payload: { projectId: projectId, boardId: board.boardId, boardName: board.boardName }
                });
            }
        });

        hubState.hubConnection.on("UpdateBoard", (_projectId: number, board: BoardGetDto) => {
            if (dispatch) {
                dispatch({ type: "UPDATE_BOARD", payload: { boardId: board.boardId, boardName: board.boardName } });
            }
        })

        hubState.hubConnection.on("DeleteBoard", (boardId: number)=> {
            if (dispatch) {
                dispatch({ type: "DELETE_BOARD", payload: { boardId: boardId } });
            }
        })

    }, [dispatch, hubState.hubConnection, props.boardId]);

    if (props.boardId === null) {
        return (
            <div className="board-body no-board-selected">
                <p>No board selected</p>
            </div>
        )
    }

    return (
        <div className="board-body">
            <div className="current-board-header">
                <p>Labels: </p>
                {
                    currentFilteringLabels.length > 0 ? (
                        <div className="board-labels">
                            {
                                currentFilteringLabels.map((labelId: number) => {
                                    return getLabelJsxFor(labelId);
                                })
                            }
                        </div>
                    ) : (
                        <button className="button standard-button"
                                onClick={(e) => startEditingLabels(e.currentTarget)}>All</button>
                    )
                }

                { isEditingLabels && <LabelSelector element={seeLabelsButtonRef} onClose={() => setIsEditingLabels(false)}
                                                    actionTitle="Filter labels"
                                                    boardId={props.boardId} projectId={props.projectId}
                                                    selectedLabels={currentFilteringLabels}
                                                    onLabelSelected={onFilteringLabelSelected} onLabelUnselected={onFilteringLabelUnselected}/>
                }
            </div>
            <div className="board-content">
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
            { cardId !== undefined && loaded && createPortal(<ViewCardDetailsComp/>, document.body) }
        </div>
    )
}

export default BoardComp;