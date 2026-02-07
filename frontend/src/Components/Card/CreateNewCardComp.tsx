import type { CardListGetDto } from "../../Models/BackendDtos/Kanban/CardListGetDto.ts";
import { type FormEvent, useEffect, useRef, useState } from "react";
import {useKanbanDispatch} from "../../Contexts/Kanban/Hooks.ts";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {CardGetDto} from "../../Models/BackendDtos/Kanban/CardGetDto.ts";
import {API_BASE_URL} from "../../config/api.ts";

const CreateNewCardComp = (props: { cardList: CardListGetDto, boardId: number }) => {

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [cardName, setCardName] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);
    const cardRef = useRef<HTMLInputElement>(null);
    const dispatch = useKanbanDispatch();
    const { checkRefresh } = useAuth();

    function handleClicked() {

        setIsCreating(true);
        setTimeout(() => {
            cardRef.current?.focus();
        }, 0)

    }

    function resetForm() {

        setCardName("");
        setIsCreating(false);

    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        if (dispatch) {
            const predictedCardId = Date.now() * -1;

            dispatch({ type: "CREATE_CARD_OPTIMISTIC", payload: { cardListId: props.cardList.cardListId, cardId: predictedCardId, cardName: cardName } })

            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken) {
                dispatch({ type: "CREATE_CARD_FAILED", payload: { failedCardId: predictedCardId } })
                return;
            }

            fetch(`${API_BASE_URL}/board/${props.boardId}/cardlist/${props.cardList.cardListId}/card`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
                    body: JSON.stringify({ cardName: cardName })
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Failed to create a card");
                    }

                    return res.json();
                })
                .then((card: CardGetDto) => {
                    dispatch({ type: "CREATE_CARD_SUCCEEDED", payload: { predictedCardId: predictedCardId, actualCardId: card.cardId } })
                })
                .catch(err => {
                    dispatch({ type: "CREATE_CARD_FAILED", payload: { failedCardId: predictedCardId } })
                    console.error(err);
                })
        }

        resetForm();

    }

    function handleReset(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();
        resetForm();

    }

    useEffect(() => {

        if (!isCreating) return;

        function handleClickOutside(e: MouseEvent) {

            if (!formRef.current) return;

            if (!formRef.current.contains(e.target as Node)) {
                resetForm();
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }

    }, [isCreating]);

    return (
        <>
            { isCreating ? (
                <form className="creation-card-form" onSubmit={handleSubmit} onReset={handleReset} ref={formRef}>
                    <input ref={cardRef} type="text"
                           placeholder="Enter a card name..."
                           className="classic-input"
                           maxLength={32} minLength={1} required
                           value={cardName}
                           onChange={(e) => setCardName(e.target.value)}/>
                    <span>
                        <button className={`button ${ cardName.length > 0 ? "valid-submit-button" : "standard-button" }`} type="submit">
                            Submit
                        </button>
                        <button type="reset">X</button>
                    </span>
                </form>
            ) : (
                <div onClick={handleClicked} className="creation-card">
                    <p>+</p>
                </div>
            )}
        </>
    );
}

export default CreateNewCardComp;