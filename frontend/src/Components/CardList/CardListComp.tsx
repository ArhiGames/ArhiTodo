import type { CardListGetDto } from "../../Models/BackendDtos/GetDtos/CardListGetDto.ts";
import type { CardGetDto } from "../../Models/BackendDtos/GetDtos/CardGetDto.ts";
import CardComp from "../Card/CardComp.tsx";
import CreateNewCardComp from "../Card/CreateNewCardComp.tsx";

const CardListComp = (props: { boardId: number, cardList: CardListGetDto }) => {
    return (
        <div className="cardlist">
            <div className="cardlist-background">
                <h3>{props.cardList.cardListName}</h3>
                <div className="cards">
                    {props.cardList.cards.map((card: CardGetDto)=> {
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