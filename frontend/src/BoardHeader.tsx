import type { Board } from "./Models/Board.ts";
import {Link} from "react-router-dom";

const BoardHeader = (props: { projectId: number, board: Board }) => {

    return (
        <Link className="board-header" to={`/projects/${props.projectId}/board/${props.board.boardId}/`}>
            <div>
                <p>{props.board.boardName}</p>
            </div>
        </Link>
    )
}

export default BoardHeader;