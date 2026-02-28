import Popover from "../../lib/Popover/Popover.tsx";
import { type Dispatch, type FormEvent, useEffect, useRef, useState } from "react";
import { useKanbanDispatch } from "../../Contexts/Kanban/Hooks.ts";
import type { KanbanAction } from "../../Contexts/Kanban/Actions/KanbanAction.ts";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import type { BoardGetDto } from "../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import {API_BASE_URL} from "../../config/api.ts";

const CreateNewBoardHeaderComp = () => {

    const createBoardHeaderRef = useRef<HTMLDivElement | null>(null);
    const boardNameInputRef = useRef<HTMLInputElement | null>(null);
    const { projectId } = useParams();
    const { checkRefresh, appUser } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [boardName, setBoardName] = useState<string>("");
    const dispatch: Dispatch<KanbanAction> | undefined = useKanbanDispatch();

    function onCreateBoardPressed() {
        setOpen((prev: boolean) => !prev);
    }

    function closePopover(e: MouseEvent) {
        e.stopPropagation();
        setOpen(false);
    }

    async function onCreateBoardSubmitted(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!appUser) return;

        if (dispatch) {
            const predictedId: number = Date.now() * -1;

            dispatch({ type: "CREATE_BOARD_OPTIMISTIC", payload: {
                    projectId: Number(projectId),
                    boardId: predictedId,
                    boardName: boardName,
                    ownedByUserId: appUser.id
            }});

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) {
                dispatch({ type: "CREATE_BOARD_FAILED", payload: { failedBoardId: predictedId }});
                return;
            }

            fetch(`${API_BASE_URL}/project/${projectId}/board`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
                body: JSON.stringify({ boardName: boardName })
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to create board");
                    }

                    return res.json();
                })
                .then((createdBoard: BoardGetDto) => {
                    dispatch( { type: "CREATE_BOARD_SUCCEEDED", payload: { predictedBoardId: predictedId, actualBoardId: createdBoard.boardId } } )
                    navigate(`/projects/${projectId}/board/${createdBoard.boardId}`)
                })
                .catch(err => {
                    dispatch({ type: "CREATE_BOARD_FAILED", payload: { failedBoardId: predictedId }});
                    console.error("Failed to create board", err);
                })
        }

        setOpen(false);
    }

    useEffect(() => {

        if (open) {
            boardNameInputRef.current?.focus();
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBoardName("");
        }

    }, [open]);

    return (
        <div ref={createBoardHeaderRef} onClick={onCreateBoardPressed}>
            <button className="board-header create-board-header">Create new board...</button>
            { open && (
                <Popover element={createBoardHeaderRef} triggerElement={createBoardHeaderRef} close={closePopover}>
                    <div className="create-new-board-popup">
                        <form onSubmit={onCreateBoardSubmitted}>
                            <input style={{ width: "100%" }} className="classic-input"
                                   placeholder="Board name..." value={boardName}
                                   onChange={e => setBoardName(e.target.value)}
                                   maxLength={32}
                                   ref={boardNameInputRef}/>
                            <button className={`button ${boardName.length > 0 ? "valid-submit-button" : "standard-button"}`} type="submit">Create</button>
                        </form>
                    </div>
                </Popover>)
            }
        </div>
    )

}

export default CreateNewBoardHeaderComp;