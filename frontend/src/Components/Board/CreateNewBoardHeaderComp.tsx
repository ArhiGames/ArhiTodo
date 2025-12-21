import Popover from "../../lib/Popover/Popover.tsx";
import { type FormEvent, useEffect, useRef, useState } from "react";

const CreateNewBoardHeaderComp = () => {

    const createBoardHeaderRef = useRef<HTMLDivElement | null>(null);
    const boardNameInputRef = useRef<HTMLInputElement | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [boardName, setBoardName] = useState<string>("");

    function onCreateBoardPressed() {
        setOpen(true);
    }

    function closePopover(e: MouseEvent) {
        e.stopPropagation();
        setOpen(false);
    }

    function onCreateBoardSubmitted(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
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