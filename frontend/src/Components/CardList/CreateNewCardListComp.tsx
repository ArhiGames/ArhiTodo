import {type Dispatch, type FormEvent, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {useKanbanDispatch} from "../../Contexts/Kanban/Hooks.ts";
import type {Action} from "../../Contexts/Kanban/Actions/Action.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {CardListGetDto} from "../../Models/BackendDtos/GetDtos/CardListGetDto.ts";
import {API_BASE_URL} from "../../config/api.ts";

const CreateNewCardListComp = () => {

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [cardListName, setCardListName] = useState<string>("");
    const cardListNameRef = useRef<HTMLInputElement>(null);
    const creationCardListRef = useRef<HTMLDivElement>(null)
    const dispatch: Dispatch<Action> | undefined = useKanbanDispatch();
    const { boardId } = useParams();
    const { token, checkRefresh } = useAuth();

    function onStartCreatingNewCardClicked() {

        setIsCreating(true);
        setTimeout(() => {

            cardListNameRef.current?.focus();

        }, 0);
    }

    function closeForm() {

        setIsCreating(false);
        setCardListName("");

    }

    async function onCardlistSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();
        if (dispatch && boardId !== undefined) {
            const predictedId = Date.now() * -1;

            dispatch({ type: "CREATE_CARDLIST_OPTIMISTIC", payload: { boardId: Number(boardId), cardListId: predictedId, cardListName: cardListName } })

            const succeeded = await checkRefresh();
            if (!succeeded) {
                dispatch({ type: "CREATE_CARDLIST_FAILED", payload: { failedCardlistId: predictedId } })
                return;
            }

            fetch(`${API_BASE_URL}/board/${boardId}/cardlist`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ cardListName: cardListName })
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Could not post new cardlist");
                    }

                    return res.json();
                })
                .then((createdCardList: CardListGetDto) => {
                    dispatch({ type: "CREATE_CARDLIST_SUCCEEDED", payload: { predictedCardlistId: predictedId, actualCardlistId: createdCardList.cardListId} })
                })
                .catch(err => {
                    dispatch({ type: "CREATE_CARDLIST_FAILED", payload: { failedCardlistId: predictedId } })
                    console.error(err);
                });
        }

        closeForm();
    }

    useEffect(() => {

        if (!isCreating) return;

        function handleClickOutside(e: MouseEvent) {

            if (!creationCardListRef.current) return;

            if (!creationCardListRef.current.contains(e.target as Node)) {
                closeForm();
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [isCreating]);

    return (
        <>
            { isCreating ? (
                <div className="creation-cardlist" ref={creationCardListRef}>
                    <form onSubmit={(e: FormEvent<HTMLFormElement>) => onCardlistSubmit(e)}>
                        <input ref={cardListNameRef} placeholder="Name of a card list..."
                               type="text" value={cardListName}
                               onChange={(e) => setCardListName(e.target.value)}
                               maxLength={35}
                               className="classic-input">
                        </input>
                        <button className={`button ${ cardListName.length > 0 ? "valid-submit-button" : "standard-button" }`} type="submit">Add list</button>
                    </form>
                </div>
            ) : (
                <button className="add-cardlist-button" onClick={() => onStartCreatingNewCardClicked()}>Create new card list...</button>
            )}
        </>
    )
}

export default CreateNewCardListComp;