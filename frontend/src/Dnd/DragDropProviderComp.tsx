import {DragDropProvider} from "@dnd-kit/react";
import {isSortable} from '@dnd-kit/dom/sortable';
import {useKanbanDispatch, useKanbanState} from "../Contexts/Kanban/Hooks.ts";
import {
    type CardMoveIndexByIdResult,
    getCardOnCardListMoveIndexById,
    getCardOnCardMoveIndexById
} from "./Helpers/getCardMoveIndexById.ts";
import {API_BASE_URL} from "../config/api.ts";
import {matchPath} from "react-router-dom";
import {useAuth} from "../Contexts/Authentication/useAuth.ts";

interface Props {
    children: React.ReactNode;
}

const DragDropProviderComp = ({children}: Props) => {

    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { checkRefresh } = useAuth();
    const match = matchPath({ path: "/projects/:projectId/board/:boardId" }, location.pathname);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function doDragDrapChecks(event: any, finalized: boolean) {
        const { source, target } = event.operation;

        if (isSortable(source)) {
            if (source.type === "card" && (target?.type === "card" || target?.type === "cardlist")) {
                const sourceId: number = Number(source.id);
                const targetId: number = Number(target.id);
                const cardMovedByIndexResult: CardMoveIndexByIdResult | undefined =
                    target?.type === "card" ? getCardOnCardMoveIndexById(kanbanState, targetId) :
                    target?.type === "cardlist" ? getCardOnCardListMoveIndexById(kanbanState, targetId) : undefined;
                if (!cardMovedByIndexResult) return;
                console.log(sourceId, targetId, target.type);

                moveCardOptimistically(sourceId, cardMovedByIndexResult);
                if (finalized) postCardMovedChanges(sourceId, cardMovedByIndexResult);
            }
        }
    }

    function moveCardOptimistically(movingCardId: number, cardMovedByIndexResult: CardMoveIndexByIdResult) {
        if (dispatch) {
            dispatch({
                type: "MOVE_CARD", payload: {
                    cardId: Number(movingCardId),
                    toCardListId: cardMovedByIndexResult.newCardListId,
                    toIndex: cardMovedByIndexResult.newIndex
                }
            });
        }
    }

    async function postCardMovedChanges(movingCardId: number, cardMovedByIndexResult: CardMoveIndexByIdResult) {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/board/${match?.params.boardId}/card/${movingCardId}/move`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ location: cardMovedByIndexResult.newIndex, cardListId: cardMovedByIndexResult.newCardListId })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to move card!");
                }
            })
            .catch(console.error)
    }

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                if (event.canceled) return;
                doDragDrapChecks(event, true);
            }}
            >
            {children}
        </DragDropProvider>
    )
}

export default DragDropProviderComp;