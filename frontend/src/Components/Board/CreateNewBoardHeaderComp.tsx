import Popover from "../../lib/Popover/Popover.tsx";
import { type Dispatch, type FormEvent, useEffect, useRef, useState } from "react";
import { useKanbanDispatch, useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import type { Action } from "../../Contexts/Kanban/Actions/Action.ts";
import { useParams } from "react-router-dom";
import type { State } from "../../Models/States/types.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";

const CreateNewBoardHeaderComp = () => {

    const createBoardHeaderRef = useRef<HTMLDivElement | null>(null);
    const boardNameInputRef = useRef<HTMLInputElement | null>(null);
    const { projectId } = useParams();
    const { token } = useAuth();
    const [open, setOpen] = useState<boolean>(false);
    const [boardName, setBoardName] = useState<string>("");
    const dispatch: Dispatch<Action> | undefined = useKanbanDispatch();
    const kanbanState: State = useKanbanState();

    function onCreateBoardPressed() {
        setOpen(true);
    }

    function closePopover(e: MouseEvent) {
        e.stopPropagation();
        setOpen(false);
    }

    function onCreateBoardSubmitted(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (dispatch) {
            let maxKeyValue: number = 0;
            Object.keys(kanbanState.boards).forEach((key: string)=> {
                if (maxKeyValue < Number(key)) {
                    maxKeyValue = Number(key);
                }
            });
            dispatch({type: "CREATE_BOARD_OPTIMISTIC", payload: { projectId: Number(projectId), boardId: maxKeyValue + 1, boardName: boardName }});

            fetch(`https://localhost:7069/api/project/${projectId}/board`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ boardName: boardName })
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to create board");
                    }
                })
                .catch(err => {
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
                <Popover element={createBoardHeaderRef} close={closePopover}>
                    <div className="create-new-board-popup">
                        <form onSubmit={onCreateBoardSubmitted}>
                            <input style={{ width: "100%" }} className="classic-input"
                                   placeholder="Board name..." value={boardName}
                                   onChange={e => setBoardName(e.target.value)}
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