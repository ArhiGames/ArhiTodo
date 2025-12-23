import type { CardListGetDto } from "../../Models/BackendDtos/GetDtos/CardListGetDto.ts";
import { type FormEvent, useEffect, useRef, useState } from "react";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type {State} from "../../Models/States/types.ts";
import {useParams} from "react-router-dom";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import type {CardGetDto} from "../../Models/BackendDtos/GetDtos/CardGetDto.ts";

const CreateNewCardComp = (props: { cardList: CardListGetDto }) => {

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [cardName, setCardName] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);
    const cardRef = useRef<HTMLInputElement>(null);
    const dispatch = useKanbanDispatch();
    const kanbanState: State = useKanbanState();
    const { projectId, boardId } = useParams();
    const { token } = useAuth();

    function handleClicked() {

        setIsCreating(true);
        setTimeout(() => {
            cardRef.current?.focus();
        }, 0)

    }

    function resetForm() {

        setCardName("");

        if (dispatch) {
            let currentMaxValue = 0;
            Object.keys(kanbanState.cards).forEach((cardId: string) => {
                if (currentMaxValue < Number(cardId)) {
                    currentMaxValue = Number(cardId);
                }
            })
            const predictedCardId = currentMaxValue + 1;

            dispatch({ type: "CREATE_CARD_OPTIMISTIC", payload: { cardListId: props.cardList.cardListId, cardId: predictedCardId, cardName: cardName } })

            fetch(`https://localhost:7069/api/project/${projectId}/board/${boardId}/cardlist/${props.cardList.cardListId}/card`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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

        setIsCreating(false);

    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();
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
                           placeholder="Enter a cardlist name..."
                           className="classic-input"
                           maxLength={90}
                           value={cardName}
                           onChange={(e) => setCardName(e.target.value)}
                    ></input>
                    <span>
                        <button className={`button ${ cardName.length > 0 ? "valid-submit-button" : "standard-button" }`} type="submit">
                            Submit
                        </button>
                        <button type="reset">X</button>
                    </span>
                </form>
            ) : (
                <div onClick={handleClicked} className="card creation-card">
                    <p>+</p>
                </div>
            )}
        </>
    );
}

export default CreateNewCardComp;