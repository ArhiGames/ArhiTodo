import type { CardList } from "../../Models/CardList.ts";
import { type FormEvent, useEffect, useRef, useState } from "react";

const CreateNewCardComp = (props: { boardId: number, cardList: CardList }) => {

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [cardName, setCardName] = useState<string>("");
    const formRef = useRef<HTMLFormElement>(null);
    const cardRef = useRef<HTMLInputElement>(null);

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
                    <input ref={cardRef}
                           type="text"
                           placeholder="Enter a cardlist name..."
                           className="classic-input"
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