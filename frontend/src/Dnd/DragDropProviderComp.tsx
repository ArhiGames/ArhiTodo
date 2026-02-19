import {useKanbanDispatch, useKanbanState} from "../Contexts/Kanban/Hooks.ts";
import {
    type CardMoveIndexByIdResult, getCardMoveIndex,
    getCardOnCardListMoveIndexById,
} from "./Helpers/DndHelpers.ts";
import {API_BASE_URL} from "../config/api.ts";
import {matchPath} from "react-router-dom";
import {useAuth} from "../Contexts/Authentication/useAuth.ts";
import {DragDropProvider} from "@dnd-kit/react";
import {extractId} from "./Helpers/DndHelpers.ts";

interface Props {
    children: React.ReactNode;
}

const DragDropProviderComp = ({children}: Props) => {

    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { checkRefresh } = useAuth();
    const match = matchPath({ path: "/projects/:projectId/board/:boardId" }, location.pathname);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function doDragEndChecks(event: any) {
        const { source, target } = event.operation;

        if (source.type === "card" && (target?.type === "card" || target?.type === "cardlist")) {
            const cardMovedByIndexResult: CardMoveIndexByIdResult | undefined = moveCardOptimistically(source, target);
            if (!cardMovedByIndexResult) return;

            const sourceId: number = extractId(source.id);
            postCardMovedChanges(sourceId, cardMovedByIndexResult).catch(console.error);
        }

        if (dispatch) {
            dispatch({ type: "SET_DRAGGING_TARGET_ID", payload: null })
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function updateDragOverState(event: any) {
        const { source, target } = event.operation;

        if (source.type === "card" && (target?.type === "card" || target?.type === "cardlist")) {
            const cardMovedByIndexResult: CardMoveIndexByIdResult | undefined = moveCardOptimistically(source, target);
            if (!cardMovedByIndexResult) return;

            if (dispatch) {
                dispatch({
                    type: "SET_DRAGGING_TARGET_ID", payload: {
                        source, target, targetIndex: cardMovedByIndexResult.newIndex
                    }
                });
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function moveCardOptimistically(source: any, target: any): CardMoveIndexByIdResult | undefined  {
        const sourceId: number = extractId(source.id);
        const targetId: number = extractId(target.id);

        console.clear();

        const cardMovedByIndexResult: CardMoveIndexByIdResult | undefined =
            target?.type === "card" ? getCardMoveIndex(kanbanState, target) :
            target?.type === "cardlist" ? getCardOnCardListMoveIndexById(kanbanState, targetId) : undefined;
        if (!cardMovedByIndexResult) return;

        console.warn("newIndex: ", cardMovedByIndexResult.newIndex, "targetId: ", targetId);
        console.warn("sourceId: ", sourceId);

        if (dispatch) {
            dispatch({
                type: "MOVE_CARD", payload: {
                    cardId: Number(sourceId),
                    toCardListId: cardMovedByIndexResult.newCardListId,
                    toIndex: cardMovedByIndexResult.newIndex
                }
            });
        }

        return cardMovedByIndexResult;
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
            onDragOver={(event) => {
                updateDragOverState(event);
            }}
            onDragEnd={(event) => {
                doDragEndChecks(event);
            }}
            >
            {children}
        </DragDropProvider>
    )
}

export default DragDropProviderComp;