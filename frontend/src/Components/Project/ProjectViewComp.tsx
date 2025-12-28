import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BoardHeader from "../Board/BoardHeader.tsx";
import BoardComp from "../Board/BoardComp.tsx";
import CreateNewBoardHeaderComp from "../Board/CreateNewBoardHeaderComp.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type { Board, State } from "../../Models/States/types.ts";
import { useKanbanDispatch, useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import ViewCardDetailsComp from "../Card/ViewCardDetailsComp.tsx";
import {createPortal} from "react-dom";

const ProjectViewComp = () => {

    const { token } = useAuth();
    const { projectId, boardId, cardId } = useParams();
    const state: State = useKanbanState();
    const navigate = useNavigate();
    const dispatch = useKanbanDispatch();

    const projectIdNum: number = Number(projectId ?? 0);

    const [activeBoardId, setActiveBoardId] = useState<number | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function loadDefaultBoard() {

        if (!boardId && Object.keys(state.boards).length > 0) {
            let firstId: number = -1;
            Object.values(state.boards).forEach((board: Board) => {
                if (board.projectId === Number(projectId)) {
                    firstId = board.boardId;
                }
            })
            if (firstId > 0) {
                setActiveBoardId(firstId);
                navigate(`/projects/${projectId}/board/${firstId}`, { replace: true });
            }
        }

    }

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
                    dispatch({ type: "INIT_BOARDS", payload: { projectId: Number(projectId), boards: fetchedBoards }});
                }

            })
            .catch(console.error);

    }, [dispatch, projectId, token]);

    useEffect(() => {
        loadDefaultBoard();
    }, [loadDefaultBoard, state.boards]);

    useEffect(() => {
        if (boardId) {
            setActiveBoardId(Number(boardId));
        }
    }, [boardId]);

    return (
        <div className="project-view">
            <div className="board-selectors">
                {Object.values(state.boards).map((board: Board) => {
                    return (
                        board.projectId === projectIdNum ?
                            <BoardHeader isSelected={board.boardId === Number(boardId)} key={board.boardId} projectId={projectIdNum} board={board}/> : null
                    )
                })}
                <CreateNewBoardHeaderComp/>
            </div>
            <BoardComp projectId={projectIdNum} boardId={activeBoardId}/>
            { cardId !== undefined && createPortal(<ViewCardDetailsComp/>, document.body) }
        </div>
    )
}

export default ProjectViewComp;