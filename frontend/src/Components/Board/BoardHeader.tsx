import { Link } from "react-router-dom";
import type { Board } from "../../Models/States/types.ts";
import { type FormEvent, useEffect, useRef, useState } from "react";
import Popover from "../../lib/Popover/Popover.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type {BoardGetDto} from "../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import { createPortal } from "react-dom";
import ConfirmationModal from "../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../config/api.ts";
import "./BoardHeader.css"

const BoardHeader = (props: { projectId: number, board: Board, isSelected: boolean }) => {

    const { appUser, jwtPayload, checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const kanbanState = useKanbanState();

    const containerDivRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [newName, setNewName] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTryingToDelete, setIsTryingToDelete] = useState<boolean>(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, [isEditing]);

    function onEditBoardClicked(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
    }

    async function onEditBoardNameSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${props.projectId}/board`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
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
                    dispatch({ type: "UPDATE_BOARD", payload: { boardId: editedBoard.boardId, boardName: editedBoard.boardName } });
                }
            })
            .catch(console.error)
            .finally(() => {
                setNewName("");
            })

        setIsEditing(false);
    }

    function tryDeleteBoard() {
        setIsTryingToDelete(true);
        setIsEditing(false);
    }

    async function deleteBoard() {

        setIsTryingToDelete(false);

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${props.projectId}/board/${props.board.boardId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to delete board");
                }

                if (dispatch) {
                    dispatch({type: "DELETE_BOARD", payload: { boardId: props.board.boardId }});
                }
            })
            .catch(console.error)
            .finally(() => {
                setNewName("");
            });
    }

    function mayEditBoard(): boolean {
        const hasGlobalPermission = jwtPayload?.ModifyOthersProjects === "true";
        const isProjectManager = kanbanState.projectPermission[props.projectId]?.isManager;
        const hasBoardPermission = kanbanState.boardUserClaims[props.board.boardId]
            ?.some(buc => buc.claimType === "ManageBoard" && buc.claimValue === "true");
        return hasGlobalPermission || isProjectManager || hasBoardPermission;
    }

    function mayDeleteBoard(): boolean {
        const hasGlobalPermission = jwtPayload?.ModifyOthersProjects === "true";
        const isProjectManager = kanbanState.projectPermission[props.projectId]?.isManager;
        const isOwner = kanbanState.boards[props.board.boardId].ownedByUserId === appUser?.id;
        return hasGlobalPermission || isProjectManager || isOwner;
    }

    return (
        <>
            <div ref={containerDivRef}>
                <Link className={`board-header ${props.isSelected ? " selected-board-header" : ""}`} to={`/projects/${props.projectId}/board/${props.board.boardId}`}>
                    <p>{props.board.boardName}</p>
                    { (mayEditBoard() || mayDeleteBoard()) && <img className="icon" onClick={onEditBoardClicked} height="16px" src="/edit-icon.svg" alt="Edit"/> }
                </Link>
                {
                    isEditing && (
                        <Popover element={containerDivRef} close={() => setIsEditing(false)}>
                            <div className="edit-board-popup">
                                <form onSubmit={onEditBoardNameSubmit}>
                                    { mayEditBoard() && (
                                        <>
                                            <label>Title</label>
                                            <input ref={inputRef} className="classic-input" placeholder={props.board.boardName} maxLength={35} required
                                                   value={newName} onChange={(e) => setNewName(e.target.value)}/>
                                        </>
                                    )}
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        { mayEditBoard() && <button type="submit" className={`button ${newName.length > 0 ? "valid-submit-button" : "standard-button"}`}>Change</button> }
                                        { mayDeleteBoard() && (
                                            <button onClick={tryDeleteBoard} type="button" className="button standard-button button-with-icon">
                                                <img src="/trashcan-icon.svg" alt="" className="icon" style={{ height: "24px" }}></img>
                                                <p>Delete</p>
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </Popover>
                    )
                }
            </div>
            {
                isTryingToDelete && mayDeleteBoard() && (
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