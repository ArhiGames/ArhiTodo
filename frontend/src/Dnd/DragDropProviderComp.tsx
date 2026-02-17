import {DragDropProvider} from "@dnd-kit/react";
import {isSortable} from '@dnd-kit/dom/sortable';
import {useKanbanDispatch, useKanbanState} from "../Contexts/Kanban/Hooks.ts";
import {
    type CardMoveIndexByIdResult,
    getCardOnCardListMoveIndexById,
    getCardOnCardMoveIndexById
} from "./Helpers/getCardMoveIndexById.ts";

interface Props {
    children: React.ReactNode;
}

const DragDropProviderComp = ({children}: Props) => {

    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function doDragDrapChecks(event: any) {
        const { source, target } = event.operation;

        if (isSortable(source)) {
            if (source.type === "card" && (target?.type === "card" || target?.type === "cardlist")) {
                const cardMovedByIndexResult: CardMoveIndexByIdResult | undefined =
                    target?.type === "card" ? getCardOnCardMoveIndexById(kanbanState, Number(target.id)) :
                        target?.type === "cardlist" ? getCardOnCardListMoveIndexById(kanbanState, Number(target.id)) : undefined;
                if (!cardMovedByIndexResult) return;

                if (dispatch) {
                    dispatch({
                        type: "MOVE_CARD", payload: {
                            cardId: Number(source.id),
                            toCardListId: cardMovedByIndexResult.newCardListId,
                            toIndex: cardMovedByIndexResult.newIndex
                        }
                    });
                }
            }
        }
    }

    return (
        <DragDropProvider
            onDragOver={(event) => {
                doDragDrapChecks(event);
            }}
            onDragEnd={(event) => {
                if (event.canceled) return;
                doDragDrapChecks(event);
            }}
            >
            {children}
        </DragDropProvider>
    )
}

export default DragDropProviderComp;