import {useEffect, useState} from "react";
import type {Board} from "../../Models/Board.ts";
import type {CardList} from "../../Models/CardList.ts";
import CardListComp from "../CardList/CardListComp.tsx";
import CreateNewCardListComp from "../CardList/CreateNewCardListComp.tsx";

const BoardComp = (props: { projectId: number, boardId: number | null }) => {

    const [board, setBoard] = useState<Board>();

    useEffect(() => {

        if (!props.boardId) return;

        fetch(`https://localhost:7069/api/project/${props.projectId}/board/${props.boardId}`, { method: 'GET' })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not fetch /api/Cards/project/${props.projectId}/board/${props.boardId}: ${res.type}`)
                }

                return res.json()
            })
            .then((res: Board) => {
                setBoard(res);
            })
            .catch(console.error);

    }, [props.projectId, props.boardId]);

    if (!props.boardId) {
        return (
            <div className="no-board-selected-body">
                <p>No board selected</p>
            </div>
        )
    }

    return (
        <div className="board-body">
            {
                board ? (
                    <>
                        {board.cardLists &&
                            board.cardLists.map((cardList: CardList) => {
                                return (
                                    <CardListComp boardId={props.boardId!} cardList={cardList} key={cardList.cardListId}></CardListComp>
                                );
                            })}
                        <CreateNewCardListComp/>
                    </>
                ) : (
                    <p>Loading...</p>
                )
            }
        </div>
    )
}

export default BoardComp;