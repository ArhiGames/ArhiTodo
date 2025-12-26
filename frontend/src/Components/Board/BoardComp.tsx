import {type Dispatch, useEffect, useRef, useState} from "react"
import type { CardListGetDto } from "../../Models/BackendDtos/GetDtos/CardListGetDto.ts";
import CardListComp from "../CardList/CardListComp.tsx";
import CreateNewCardListComp from "../CardList/CreateNewCardListComp.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import { useKanbanDispatch, useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import type { Action } from "../../Contexts/Kanban/Actions/Action.ts";
import type { BoardGetDto } from "../../Models/BackendDtos/GetDtos/BoardGetDto.ts";
import type { Board, CardList, State } from "../../Models/States/types.ts";
import type {LabelGetDto} from "../../Models/BackendDtos/GetDtos/LabelGetDto.ts";
import LabelSelector from "../../lib/Kanban/Labels/LabelSelector.tsx";

const BoardComp = (props: { projectId: number, boardId: number | null }) => {

    const { token } = useAuth();
    const dispatch: Dispatch<Action> | undefined = useKanbanDispatch();
    const kanbanState: State = useKanbanState();
    const board: BoardGetDto | null = getUnnormalizedKanbanState()
    const seeLabelsButtonRef = useRef<HTMLButtonElement | null>(null);
    const [isEditingLabels, setIsEditingLabels] = useState<boolean>(false);

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

    useEffect(() => {

        if (props.boardId == null) return;

        fetch(`https://localhost:7069/api/project/${props.projectId}/board/${props.boardId}`,
            {
                method: 'GET',
                headers: { "Authorization": `Bearer ${token}` }
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

            })
            .catch(console.error);

    }, [props.projectId, props.boardId, token, dispatch]);

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
                <button className="button standard-button" onClick={() => setIsEditingLabels(true)} ref={seeLabelsButtonRef}>All</button>
                { isEditingLabels && <LabelSelector element={seeLabelsButtonRef}
                                                    onClose={() => setIsEditingLabels(false)}
                                                    actionTitle="Filter labels"
                                                    boardId={props.boardId} projectId={props.projectId}/>
                }
            </div>
            <div className="board-content">
                {
                    board ? (
                        <>
                            { (board.cardLists && board.cardLists.length > 0) && (
                                board.cardLists.map((cardList: CardListGetDto) => {
                                    return (
                                        <CardListComp boardId={props.boardId!} cardList={cardList} key={cardList.cardListId}></CardListComp>
                                    );
                                }))}
                            <CreateNewCardListComp/>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )
                }
            </div>
        </div>
    )
}

export default BoardComp;