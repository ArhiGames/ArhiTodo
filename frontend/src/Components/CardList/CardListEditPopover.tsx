import Popover from "../../lib/Popover/Popover.tsx";
import {type RefObject, useState} from "react";
import {createPortal} from "react-dom";
import ConfirmationModal from "../../lib/Modal/Confirmation/ConfirmationModal.tsx";
import {useKanbanDispatch} from "../../Contexts/Kanban/Hooks.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../config/api.ts";

interface Props {
    boardId: number;
    cardListId: number;
    editIconRef: RefObject<HTMLImageElement | null>;
    onClose: () => void;
}

const CardListEditPopover = (props: Props) => {

    const [isTryingToDeleteAllCards, setIsTryingToDeleteAllCards] = useState<boolean>(false);
    const [isTryingToDeleteCardList, setIsTryingToDeleteCardList] = useState<boolean>(false);

    const { checkRefresh } = useAuth();
    const dispatch = useKanbanDispatch();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    async function onDeleteAllCardsConfirmed() {

        if (isDeleting) return;
        setIsDeleting(true);

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            setIsDeleting(false);
            return;
        }

        fetch(`${API_BASE_URL}/board/${props.boardId}/cardlist/${props.cardListId}/cards`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not delete every card from cardlist with id ${props.cardListId}`);
                }

                if (dispatch) {
                    dispatch({type: "DELETE_CARDS_FROM_CARDLIST", payload: {fromCardListId: props.cardListId}});
                }
            })
            .catch((err) => {
                setIsDeleting(false);
                console.error(err);
            })
            .finally(() => props.onClose());

    }

    async function onDeleteCardlistConfirmed() {

        if (isDeleting) return;
        setIsDeleting(true);

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            setIsDeleting(false);
            return;
        }

        fetch(`${API_BASE_URL}/board/${props.boardId}/cardlist/${props.cardListId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Could not delete cardlist with id ${props.cardListId}`);
                }

                if (dispatch) {
                    dispatch({type: "DELETE_CARDLIST", payload: { cardListId: props.cardListId }});
                }
            })
            .catch((err) => {
                setIsDeleting(false);
                console.error(err);
            })
            .finally(() => props.onClose());

    }

    if (isTryingToDeleteAllCards) {
        return (
            createPortal(<ConfirmationModal title="Confirmation required"
                                            actionDescription="If you confirm this action, all cards in this card list will be irrevocably deleted"
                                            onClosed={() => setIsTryingToDeleteAllCards(false)}
                                            onConfirmed={onDeleteAllCardsConfirmed}/>, document.body)
        )
    }

    if (isTryingToDeleteCardList) {
        return (
            createPortal(<ConfirmationModal title="Confirmation required"
                                            actionDescription="If you confirm this action, the entire card list will be deleted. This includes all cards in the card list"
                                            onClosed={() => setIsTryingToDeleteAllCards(false)}
                                            onConfirmed={onDeleteCardlistConfirmed}/>, document.body)
        )
    }

    return (
        <Popover element={props.editIconRef} close={props.onClose}>
            <div className="cardlist-popover-actions">
                <button className="button standard-button" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                        onClick={() => setIsTryingToDeleteAllCards(true)}>
                    <img src="/public/trashcan-icon.svg" alt="" height="20px"/>
                    <p>Delete all cards from list</p>
                </button>
                <button className="button standard-button" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                        onClick={() => setIsTryingToDeleteCardList(true)}>
                    <img src="/public/trashcan-icon.svg" alt="" height="20px"/>
                    <p>Delete</p>
                </button>
            </div>
        </Popover>
    )

}

export default CardListEditPopover;