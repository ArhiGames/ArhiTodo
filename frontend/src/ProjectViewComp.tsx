import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type {Board} from "./Models/Board.ts";
import BoardHeader from "./BoardHeader.tsx";
import BoardComp from "./BoardComp.tsx";

const ProjectViewComp = () => {

    const { projectId, boardId } = useParams();
    const [boards, setBoards] = useState<Board[]>();

    const projectIdNum: number = Number(projectId ?? 0);
    const boardIdNum: number = Number(boardId ?? 0);

    useEffect(() => {

        fetch(`https://localhost:7069/api/project/${projectId}/board`, { method: "GET" })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch board");
                }

                return res.json();
            })
            .then((fetchedBoards: Board[]) => {
                setBoards(fetchedBoards);
            })
            .catch(console.error);

    }, [projectId]);

    return (
        <div className="project-view">
            <div className="board-selectors">
                {boards?.map((board: Board) => {
                    return (
                        <BoardHeader key={board.boardId} projectId={projectIdNum} board={board}/>
                    )
                })}
            </div>
            <BoardComp projectId={projectIdNum} boardId={boardIdNum}/>
        </div>
    )
}

export default ProjectViewComp;