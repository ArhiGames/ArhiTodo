import {useEffect, useRef, useState} from "react";
import type {CardList} from "../../Models/CardList.ts";

const CreateNewCardComp = (props: { boardId: number, cardList: CardList }) => {

    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [blockInput, setBlockInput] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const onCreatingClicked = () => {
        setIsCreating(true);
    }

    const onInputCommited = (value: string) => {

        if (blockInput) return false;
        if (value.length < 1) {
            setIsCreating(false);
            return false;
        }

        setBlockInput(true);

        fetch(`https://localhost:7069/api/Cards/postcard?boardId=${props.boardId}&cardListId=${props.cardList.cardListId}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cardName: value
                }),
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to creating card");
                }
            })
            .catch(console.error);

    }

    useEffect(() => {

        if (isCreating) {
            inputRef.current?.focus();
        }

    }, [isCreating]);

    return (
        <div className="creation-card" onClick={() => onCreatingClicked()}>
            {isCreating ? (
                <input ref={inputRef} type="text" placeholder="Enter you todo..."
                       onBlur={(e) => onInputCommited(e.target.value)}
                       onKeyDown={(e) => {
                           if (e.key === "Enter") {
                               onInputCommited(e.currentTarget.value);
                           }
                       }}
                ></input>
            ) : (
                <p>+</p>
            )}
        </div>
    );
}

export default CreateNewCardComp;