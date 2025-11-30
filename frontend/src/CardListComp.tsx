import type {CardList} from "./Models/CardList.ts";
import type {Card} from "./Models/Card.ts";
import CardComp from "./CardComp.tsx";
import CreateNewCardComp from "./CreateNewCardComp.tsx";

const CardListComp = (props: { boardId: number, cardList: CardList }) => {
    return (
        <div className="cardlist">
            <div className="cardlist-background">
                <h3>{props.cardList.cardListName}</h3>
                <div className="cards">
                    {props.cardList.cards.map((card: Card)=> {
                        return (
                            <CardComp card={card} key={card.cardId}></CardComp>
                        )
                    })}
                </div>
                <CreateNewCardComp boardId={props.boardId} cardList={props.cardList} />
            </div>
        </div>
    )
}

export default CardListComp;