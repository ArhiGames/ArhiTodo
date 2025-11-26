import {useEffect, useState} from "react";
import type { Board } from "./Models/Board.ts";

const BoardHeader = () => {
    const [board, setBoard] = useState<Board>();
    const [inputBoardName, setInputBoardName] = useState<string>('')

    const refreshBoardInformation = () => {
        fetch(`https://localhost:7069/api/Cards?boardId=${1}`, { method: 'GET' })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to get board')
                }

                return res.json();
            })
            .then((res: Board)  => {
                setBoard(res);
                setInputBoardName(res.boardName);
            })
            .catch(console.error);
    }

    const onBoardNameConfirmed = (newBoardName: string) => {
        if (newBoardName === board?.boardName) {
            return;
        }

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
        <div>
            <div className="fake-header"></div>

            <div className="board-header">
                <input type="text" placeholder="Board name" value={inputBoardName}
                       onChange={(e) => setInputBoardName(e.target.value)}
                       onBlur={(e) => onBoardNameConfirmed(e.target.value)}>
                </input>
            </div>
        </div>
    )
}

export default BoardHeader;