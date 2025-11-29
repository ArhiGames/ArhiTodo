import {useEffect, useState} from "react";
import type {Board} from "./Models/Board.ts";
import type {CardList} from "./Models/CardList.ts";
import CardListComp from "./CardListComp.tsx";

const BoardComp = (props: { projectId: number, boardId: number }) => {

    const [board, setBoard] = useState<Board>();

    useEffect(() => {

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

    return (
        <div className="board-body">
            {!board && <p>Loading...</p>}
            {board?.cardLists &&
                board?.cardLists.map((cardList: CardList) => {
                return (
                    <CardListComp boardId={props.boardId} cardList={cardList} key={cardList.cardListId}></CardListComp>
                );
            })}
        </div>
    )
}

export default BoardComp;