import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BoardHeader from "../Board/BoardHeader.tsx";
import BoardComp from "../Board/BoardComp.tsx";
import CreateNewBoardHeaderComp from "../Board/CreateNewBoardHeaderComp.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type { Board, State } from "../../Models/States/types.ts";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";

const ProjectViewComp = () => {

    const { token } = useAuth();
    const { projectId, boardId } = useParams();
    const state: State = useKanbanState();
    const navigate = useNavigate();
    const dispatch = useKanbanDispatch();

    const projectIdNum: number = Number(projectId ?? 0);

    const [activeBoardId, setActiveBoardId] = useState<number | null>(null);

    useEffect(() => {

        fetch(`https://localhost:7069/api/project/${projectId}/board`,
            {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch boards");
                }

                return res.json();
            })
            .then((fetchedBoards: Board[]) => {

                if (dispatch) {
                    dispatch({type: "INIT_BOARDS", payload: fetchedBoards});
                }

            })
            .catch(console.error);

    }, [dispatch, projectId, token]);

    useEffect(() => {

        if (!state.boards || Object.keys(state.boards).length === 0) return;
        if (boardId) return;

        const firstKey: number = Number(Object.keys(state.boards)[0]);
        const firstId = state.boards[firstKey].boardId;

        queueMicrotask(() => {
            setActiveBoardId(firstId);
            navigate(`/projects/${projectId}/board/${firstId}`, { replace: true });
        })

    }, [state.boards, boardId, projectId, navigate]);

    useEffect(() => {
        if (boardId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveBoardId(Number(boardId));
        }
    }, [boardId]);

    return (
        <div className="project-view">
            <div className="board-selectors">
                {Object.values(state.boards).map((board: Board) => {
                    return (
                        <BoardHeader isSelected={board.boardId === Number(boardId)} key={board.boardId} projectId={projectIdNum} board={board}/>
                    )
                })}
                <CreateNewBoardHeaderComp/>
            </div>
            <BoardComp projectId={projectIdNum} boardId={activeBoardId}/>
        </div>
    )
}

export default ProjectViewComp;