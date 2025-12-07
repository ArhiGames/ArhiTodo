import type {CardList} from "../../Models/CardList.ts";

const CreateNewCardComp = (props: { boardId: number, cardList: CardList }) => {

    return (
        <div className="card creation-card">
            <p>+ Board Id: {props.boardId}</p>
        </div>
    );
}

export default CreateNewCardComp;