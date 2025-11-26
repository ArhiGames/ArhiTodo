import type {CardList} from "./Models/CardList.ts";
import type {Card} from "./Models/Card.ts";
import CardComp from "./CardComp.tsx";

const CardListComp = (props: { cardList: CardList }) => {
    return (
        <div className="cardlist-background">
            <h3>{props.cardList.cardListName}</h3>
            <div className="cards">
                {props.cardList.cards.map((card: Card)=> {
                    return (
                        <CardComp card={card} key={card.cardId}></CardComp>
                    )
                })}
            </div>
        </div>
    )
}

export default CardListComp;