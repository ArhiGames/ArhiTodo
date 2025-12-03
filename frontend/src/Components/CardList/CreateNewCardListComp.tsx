import {useState} from "react";

const CreateNewCardListComp = () => {

    const [isCreating, setIsCreating] = useState<boolean>(false);

    function onStartCreatingNewCardClicked() {

        setIsCreating(true);

    }

    return (
        <div className="creation-cardlist">
            { isCreating ? (
                <form>
                    <input placeholder="Name of a card list..." type="text"></input>
                    <button className="add-button">Add list</button>
                </form>
            ) : (
                <button className="add-cardlist-button" onClick={() => onStartCreatingNewCardClicked()}>Create new card list...</button>
            ) }
        </div>
    )
}

export default CreateNewCardListComp;