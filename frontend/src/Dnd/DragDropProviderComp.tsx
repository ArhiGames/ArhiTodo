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
import {useRealtimeHub} from "../Contexts/Realtime/Hooks.ts";

interface Props {
    children: React.ReactNode;
}

const DragDropProviderComp = ({children}: Props) => {

    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const hubConnection = useRealtimeHub();
    const { checkRefresh } = useAuth();
    const match = matchPath({ path: "/projects/:projectId/board/:boardId" }, location.pathname);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function doDragEndChecks(event: any) {
        const { source, target } = event.operation;

        const sourceId: number = extractId(source.id);
        if (source.type === "card" && (target?.type === "card" || target?.type === "cardlist")) {
            const cardMovedByIndexResult: CardMoveIndexByIdResult | undefined = moveCardOptimistically(source, target);
            if (!cardMovedByIndexResult) return;

            postCardMovedChanges(sourceId, cardMovedByIndexResult).catch(console.error);
        } else if (source.type === "cardlist" && (target?.type === "card" || target?.type === "cardlist")) {
            const newIndex: number = moveCardListOptimistically(source, target);
            if (newIndex === -1) return;

            postCardListMovedChanges(sourceId, newIndex).catch(console.error);
        } else if (source.type === "board" && target?.type === "board") {
            const newIndex: number = moveBoardOptimistically(source, target);
            if (newIndex === -1) return;

            postBoardMovedChanges(sourceId, newIndex).catch(console.error);
        } else if (source.type === "label" && target?.type === "label") {
            const newIndex: number = moveLabelOptimistically(source, target);
            if (newIndex === -1) return;

            postLabelMovedChanges(sourceId, newIndex).catch(console.error);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function updateDragOverState(event: any) {
        const { source, target } = event.operation;

        if (source.type === "card" && (target?.type === "card" || target?.type === "cardlist")) {
            moveCardOptimistically(source, target);
        } else if (source.type === "cardlist" && (target?.type === "card" || target?.type === "cardlist")) {
            moveCardListOptimistically(source, target);
        } else if (source.type === "board" && target?.type === "board") {
            moveBoardOptimistically(source, target);
        } else if (source.type === "label" && target?.type === "label") {
            moveLabelOptimistically(source, target);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function moveCardOptimistically(source: any, target: any): CardMoveIndexByIdResult | undefined  {
        const sourceId: number = extractId(source.id);
        const targetId: number = extractId(target.id);

        const cardMovedByIndexResult: CardMoveIndexByIdResult | undefined =
            target?.type === "card" ? getCardMoveIndex(kanbanState, target) :
            target?.type === "cardlist" ? getCardOnCardListMoveIndexById(kanbanState, targetId) : undefined;
        if (!cardMovedByIndexResult) return;

        if (dispatch) {
            dispatch({
                type: "MOVE_CARD", payload: {
                    cardId: sourceId,
                    toCardListId: cardMovedByIndexResult.newCardListId,
                    toIndex: cardMovedByIndexResult.newIndex
                }
            });
        }

        return cardMovedByIndexResult;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function moveCardListOptimistically(source: any, target: any): number {
        const sourceId: number = extractId(source.id);

        const newIndex: number = target?.data.index ?? -1;
        if (newIndex === -1) {
            return -1;
        }

        if (dispatch) {
            dispatch({type: "MOVE_CARDLIST", payload: { cardListId: sourceId, toIndex: newIndex }});
        }

        return newIndex;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function moveBoardOptimistically(source: any, target: any): number {
        const sourceId: number = extractId(source.id);

        const newIndex: number = target?.data.index ?? -1;
        if (newIndex === -1) {
            return -1;
        }

        if (dispatch) {
            dispatch({type: "MOVE_BOARD", payload: { boardId: sourceId, toIndex: newIndex }});
        }

        return newIndex;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function moveLabelOptimistically(source: any, target: any): number {
        const sourceId: number = extractId(source.id);

        const newIndex: number = target?.data.index ?? -1;
        if (newIndex === -1) {
            return -1;
        }

        if (dispatch) {
            dispatch({type: "MOVE_LABEL", payload: { labelId: sourceId, toIndex: newIndex }});
        }

        return newIndex;
    }

    async function postCardMovedChanges(movingCardId: number, cardMovedByIndexResult: CardMoveIndexByIdResult) {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/board/${match?.params.boardId}/card/${movingCardId}/move`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
            body: JSON.stringify({ location: cardMovedByIndexResult.newIndex, cardListId: cardMovedByIndexResult.newCardListId })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to move card!");
                }
            })
            .catch(console.error)
    }

    async function postCardListMovedChanges(movingCardList: number, toIndex: number) {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/board/${match?.params.boardId}/cardlist/${movingCardList}/move/${toIndex}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to move cardlist!");
                }
            })
            .catch(console.error)
    }

    async function postBoardMovedChanges(movingBoardId: number, toIndex: number) {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/project/${match?.params.projectId}/board/${movingBoardId}/move/${toIndex}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to move board!");
                }
            })
            .catch(console.error)
    }

    async function postLabelMovedChanges(movingLabelId: number, toIndex: number) {
        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/board/${match?.params.boardId}/label/${movingLabelId}/move/${toIndex}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to move label!");
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