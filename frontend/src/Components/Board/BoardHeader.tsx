import {Link, useNavigate} from "react-router-dom";
import type { Board } from "../../Models/States/types.ts";
import {type FormEvent, useEffect, useRef, useState} from "react";
import Popover from "../../lib/Popover/Popover.tsx";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {BoardGetDto} from "../../Models/BackendDtos/GetDtos/BoardGetDto.ts";
import {useKanbanDispatch} from "../../Contexts/Kanban/Hooks.ts";
import {createPortal} from "react-dom";
import ConfirmationModal from "../../lib/Modal/Confirmation/ConfirmationModal.tsx";

const BoardHeader = (props: { projectId: number, board: Board, isSelected: boolean }) => {

    const containerDivRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [newName, setNewName] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTryingToDelete, setIsTryingToDelete] = useState<boolean>(false);
    const { token } = useAuth();
    const dispatch = useKanbanDispatch();
    const navigate = useNavigate();

    useEffect(() => {

        inputRef.current?.focus();

    }, [isEditing]);

    function onEditBoardClicked(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {

        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);

    }

    function onEditBoardNameSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        fetch(`https://localhost:7069/api/project/${props.projectId}/board`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ boardId: props.board.boardId, boardName: newName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to edit board");
                }

                return res.json();
            })
            .then((editedBoard: BoardGetDto) => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_BOARD", payload: {boardId: editedBoard.boardId, boardName: editedBoard.boardName} });
                }
            })
            .catch(console.error);

        setIsEditing(false);
    }

    function tryDeleteBoard() {

        setIsTryingToDelete(true);
        setIsEditing(false);

    }

    function deleteBoard() {

        setIsTryingToDelete(false);

        fetch(`https://localhost:7069/api/project/${props.projectId}/board/${props.board.boardId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete board");
                }

                if (dispatch) {
                    dispatch({type: "DELETE_BOARD", payload: { boardId: props.board.boardId }});
                    navigate(`/projects/${props.projectId}/board`)
                }
            })
            .catch(console.error);
    }

    return (
        <>
            <div ref={containerDivRef}>
                <Link className={`board-header ${props.isSelected ? " selected-board-header" : ""}`} to={`/projects/${props.projectId}/board/${props.board.boardId}`}>
                    <p>{props.board.boardName}</p>
                    <img onClick={onEditBoardClicked} height="16px" src="../../../public/edit-icon.svg" alt="Edit"></img>
                </Link>
                {
                    isEditing && (
                        <Popover element={containerDivRef} close={() => setIsEditing(false)}>
                            <div className="edit-board-popup">
                                <form onSubmit={onEditBoardNameSubmit}>
                                    <label>Title</label>
                                    <input ref={inputRef} className="classic-input" placeholder={props.board.boardName} maxLength={35} required
                                           value={newName} onChange={(e) => setNewName(e.target.value)}/>
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                        <button type="submit" className={`button ${newName.length > 0 ? "valid-submit-button" : "standard-button"}`}>Change</button>
                                        <button onClick={tryDeleteBoard} type="button" className="button heavy-action-button">Delete</button>
                                    </div>
                                </form>
                            </div>
                        </Popover>
                    )
                }
            </div>
            {
                isTryingToDelete && (
                    createPortal(
                        <ConfirmationModal title={`Delete board: ${props.board.boardName}`}
                            actionDescription="If you confirm this action, the board will be irrevocably deleted."
                            onClosed={() => setIsTryingToDelete(false)}
                            onConfirmed={deleteBoard}/>
                    , document.body)
                )
            }
        </>
    )
}

export default BoardHeader;