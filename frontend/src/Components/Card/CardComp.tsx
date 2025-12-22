import type {CardGetDto} from "../../Models/BackendDtos/GetDtos/CardGetDto.ts";

const CardComp = (props: { card: CardGetDto }) => {

    return (
        <div className="card">
            <p>{props.card.cardName}</p>
        </div>
    )

}

export default CardComp;