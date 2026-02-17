import {DragDropProvider} from "@dnd-kit/react";
import {isSortable} from '@dnd-kit/dom/sortable';
import {useKanbanDispatch, useKanbanState} from "../Contexts/Kanban/Hooks.ts";
import getCardMoveIndexById, {type CardMoveIndexByIdResult} from "./Helpers/getCardMoveIndexById.ts";

interface Props {
    children: React.ReactNode;
}

const DragDropProviderComp = ({ children }: Props) => {

    const kanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();

    return (
        <DragDropProvider
            onDragOver={() => {

            }}
            onDragEnd={(event) => {
                if (event.canceled) return;
                const { source, target } = event.operation;

                if (isSortable(source)) {
                    if (source.type === "card" && target?.type === "card") {
                        const cardMovedByIndexResult: CardMoveIndexByIdResult | undefined = getCardMoveIndexById(kanbanState,
                            Number(source.id), Number(target.id));
                        if (!cardMovedByIndexResult) return;
                        console.log(cardMovedByIndexResult);

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
            }}
            >
            {children}
        </DragDropProvider>
    )
}

export default DragDropProviderComp;