import {useNavigate, useParams} from "react-router-dom";
import type { Board } from "../../../Models/States/KanbanState.ts";
import {useEffect, useRef, useState} from "react";
import Popover from "../../../lib/Popover/Popover.tsx";
import { useAuth } from "../../../Contexts/Authentication/useAuth.ts";
import type {BoardGetDto} from "../../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import {useKanbanDispatch, useKanbanState} from "../../../Contexts/Kanban/Hooks.ts";
import { createPortal } from "react-dom";
import ConfirmationModal from "../../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {API_BASE_URL} from "../../../config/api.ts";
import "../BoardHeader.css"
import {usePermissions} from "../../../Contexts/Authorization/usePermissions.ts";
import {useRealtimeHub} from "../../../Contexts/Realtime/Hooks.ts";

interface Props {
    boardId: number;
}

const BoardHeader = (props: Props) => {

    const { checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const kanbanState = useKanbanState();
    const permissions = usePermissions();
    const hubConnection = useRealtimeHub();
    const navigate = useNavigate();
    const { projectId, boardId } = useParams();

    const board: Board | undefined = kanbanState.boards.get(props.boardId);
    const isBoardSelected: boolean = props.boardId === Number(boardId);

    const containerDivRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const editBoardButtonRef = useRef<HTMLImageElement>(null);

    const [newName, setNewName] = useState<string>(board?.boardName ?? "");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTryingToDelete, setIsTryingToDelete] = useState<boolean>(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, [isEditing]);

    function onEditBoardClicked(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        e.stopPropagation();
        setIsEditing((prev: boolean) => !prev);
    }

    async function onEditBoardNameSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${projectId}/board`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
            body: JSON.stringify({ boardId: props.boardId, boardName: newName })
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

        fetch(`${API_BASE_URL}/project/${projectId}/board/${props.boardId}`, {
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
                    dispatch({type: "DELETE_BOARD", payload: { boardId: props.boardId }});
                }
            })
            .catch(console.error)
            .finally(() => {
                setNewName("");
            });
    }

    function onOpenBoardClicked() {
        navigate(`/projects/${projectId}/board/${props.boardId}`);
    }

    return (
        <>
            <div ref={containerDivRef} className={`board-header ${isBoardSelected ? " selected-board-header" : ""}`}
                 onClick={onOpenBoardClicked}>
                <p>{board?.boardName}</p>
                { (permissions.hasEditBoardPermission() || permissions.hasDeleteBoardPermission())
                    && <img ref={editBoardButtonRef} className="icon" onClick={onEditBoardClicked} height="16px" src="/edit-icon.svg" alt="Edit"/> }
            </div>
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
                                    { permissions.hasEditBoardPermission() && <button type="submit" className={`button ${board?.boardName !== newName ? 
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
            {
                isTryingToDelete && permissions.hasDeleteBoardPermission() && (
                    createPortal(
                        <ConfirmationModal title={`Delete board: ${board?.boardName}`}
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