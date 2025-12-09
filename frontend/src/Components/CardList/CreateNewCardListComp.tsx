import { type FormEvent, useEffect, useRef, useState } from "react";

const CreateNewCardListComp = () => {

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [cardListName, setCardListName] = useState<string>("");
    const cardListNameRef = useRef<HTMLInputElement>(null);
    const creationCardListRef = useRef<HTMLDivElement>(null)

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

    function onCardlistSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();
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
                               maxLength={25}
                               className="classic-input">
                        </input>
                        <button className="submit-button" type="submit">Add list</button>
                    </form>
                </div>
            ) : (
                <button className="add-cardlist-button" onClick={() => onStartCreatingNewCardClicked()}>Create new card list...</button>
            )}
        </>
    )
}

export default CreateNewCardListComp;