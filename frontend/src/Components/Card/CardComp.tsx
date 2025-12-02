import type {Card} from "../../Models/Card.ts";

const CardComp = (props: { card: Card }) => {

    return (
        <div className="card">
            <p>{props.card.cardName}</p>
        </div>
    )

}

export default CardComp;