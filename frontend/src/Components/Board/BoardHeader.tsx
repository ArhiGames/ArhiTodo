import { Link } from "react-router-dom";
import type { Board } from "../../Models/States/KanbanState.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import Popover from "../../lib/Popover/Popover.tsx";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type {BoardGetDto} from "../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import {useKanbanDispatch} from "../../Contexts/Kanban/Hooks.ts";
import { createPortal } from "react-dom";
import ConfirmationModal from "../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../config/api.ts";
import "./BoardHeader.css"
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import {useRealtimeHub} from "../../Contexts/Realtime/Hooks.ts";

const BoardHeader = (props: { projectId: number, board: Board, isSelected: boolean, dndIndex: number }) => {

    const { checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const permissions = usePermissions();
    const hubConnection = useRealtimeHub();

    const containerDivRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const editBoardButtonRef = useRef<HTMLImageElement>(null);

    const [newName, setNewName] = useState<string>(props.board.boardName);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTryingToDelete, setIsTryingToDelete] = useState<boolean>(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, [isEditing]);

    function onEditBoardClicked(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.preventDefault();
        setIsEditing((prev: boolean) => !prev);
    }

    async function onEditBoardNameSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${props.projectId}/board`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
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
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
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

    const combinedRef = useCallback((node: HTMLDivElement | null) => {
            containerDivRef.current = node;
        }, []);

    return (
        <>
            <div ref={combinedRef}>
                <Link draggable="false" className={`board-header ${props.isSelected ? " selected-board-header" : ""}`} to={`/projects/${props.projectId}/board/${props.board.boardId}`}>
                    <button className="drag-handle">::</button>
                    <p>{props.board.boardName}</p>
                    { (permissions.hasEditBoardPermission() || permissions.hasDeleteBoardPermission())
                        && <img ref={editBoardButtonRef} className="icon" onClick={onEditBoardClicked} height="16px" src="/edit-icon.svg" alt="Edit"/> }
                </Link>
                {
                    isEditing && (
                        <Popover element={containerDivRef} close={() => setIsEditing(false)} triggerElement={editBoardButtonRef}>
                            <div className="edit-board-popup">
                                <form onSubmit={onEditBoardNameSubmit}>
                                    { permissions.hasEditBoardPermission() && (
                                        <>
                                            <label>Title</label>
                                            <input ref={inputRef} className="classic-input" maxLength={35} required
                                                   value={newName} onChange={(e) => setNewName(e.target.value)}/>
                                        </>
                                    )}
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        { permissions.hasEditBoardPermission() && <button type="submit" className={`button ${props.board.boardName !== newName ? 
                                            "valid-submit-button" : "standard-button"}`}>Change</button> }
                                        { permissions.hasDeleteBoardPermission() && (
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
                isTryingToDelete && permissions.hasDeleteBoardPermission() && (
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