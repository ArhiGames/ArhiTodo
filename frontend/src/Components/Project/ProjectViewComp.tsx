import {useNavigate, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import type {Board} from "../../Models/Board.ts";
import BoardHeader from "../Board/BoardHeader.tsx";
import BoardComp from "../Board/BoardComp.tsx";
import CreateNewBoardHeaderComp from "../Board/CreateNewBoardHeaderComp.tsx";

const ProjectViewComp = () => {

    const { projectId, boardId } = useParams();
    const [boards, setBoards] = useState<Board[]>();
    const navigate = useNavigate();

    const projectIdNum: number = Number(projectId ?? 0);

    const [activeBoardId, setActiveBoardId] = useState<number | null>(null);

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

    useEffect(() => {

        if (!boards || boards.length === 0) return;
        if (boardId) return;

        const firstId = boards[0].boardId;

        queueMicrotask(() => {
            setActiveBoardId(firstId);
            navigate(`/projects/${projectId}/board/${firstId}`, { replace: true });
        })

    }, [boards, boardId, projectId, navigate]);

    useEffect(() => {
        if (boardId) {
            queueMicrotask(() => {
                setActiveBoardId(Number(boardId));
            })
        }
    }, [boardId]);

    return (
        <div className="project-view">
            <div className="board-selectors">
                {boards?.map((board: Board) => {
                    return (
                        <BoardHeader key={board.boardId} projectId={projectIdNum} board={board}/>
                    )
                })}
                <CreateNewBoardHeaderComp/>
            </div>
            <BoardComp projectId={projectIdNum} boardId={activeBoardId}/>
        </div>
    )
}

export default ProjectViewComp;