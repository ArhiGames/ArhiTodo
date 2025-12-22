import { Link } from "react-router-dom";
import type { Board } from "../../Models/States/types.ts";

const BoardHeader = (props: { projectId: number, board: Board }) => {

    return (
        <Link className="board-header" to={`/projects/${props.projectId}/board/${props.board.boardId}`}>
            <div>
                <p>{props.board.boardName}</p>
            </div>
        </Link>
    )
}

export default BoardHeader;