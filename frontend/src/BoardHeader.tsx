import {useEffect, useState} from "react";
import type { Board } from "./Models/Board.ts";

const BoardHeader = () => {
    const [boardName, setBoardName] = useState<string>('')

    const refreshBoardInformation = () => {
        fetch('https://localhost:7069/api/Board', { method: 'GET' })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to get board')
                }

                return res.json();
            })
            .then((res: Board[])  => {
                setBoardName(res[0].boardName);
            })
            .catch(console.error);
    }

    const onBoardNameConfirmed = (newBoardName: string) => {
        fetch(`https://localhost:7069/api/Board`,
            {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    boardId: 1,
                    boardName: newBoardName
                })
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to refresh board name')
                }

                refreshBoardInformation();
            })
            .catch(console.error);
    }

    useEffect(() => {

        refreshBoardInformation();

    }, [])

    return (
        <div className="board-header">
            <input type="text" placeholder="Board name" value={boardName}
                   onChange={(e) => setBoardName(e.target.value)}
                   onBlur={(e) => onBoardNameConfirmed(e.target.value)}>
            </input>
        </div>
    )
}

export default BoardHeader;