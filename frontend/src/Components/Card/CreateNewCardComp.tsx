import type { CardList } from "../../Models/CardList.ts";
import { type FormEvent, useEffect, useRef, useState } from "react";

const CreateNewCardComp = (props: { boardId: number, cardList: CardList }) => {

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [cardListName, setCardListName] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);
    const cardListRef = useRef<HTMLInputElement>(null);

    function handleClicked() {

        setIsCreating(true);
        setTimeout(() => {
            cardListRef.current?.focus();
        }, 0)

    }

    function resetForm() {

        setCardListName("");
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
                    <input ref={cardListRef} type="text" placeholder="Enter a cardlist name..."></input>
                    <span>
                        <button className="submit-button" type="submit" value={cardListName} onChange={(e) => setCardListName(e.currentTarget.value)}>
                            Submit
                        </button>
                        <button type={"reset"}>X</button>
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