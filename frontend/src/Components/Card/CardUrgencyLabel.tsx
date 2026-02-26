interface Props {
    cardUrgencyLevel: number
}

const CardUrgencyLabel = ({ cardUrgencyLevel } : Props) => {

    if (cardUrgencyLevel <= 0 || cardUrgencyLevel >= 5) return null;
    const cardUrgencyString: string = ["Low", "Medium", "High", "Urgent"][cardUrgencyLevel - 1];

    return (
        <div className={`card-urgency-label ${cardUrgencyString.toLowerCase()}`}>
            <img src={`/urgency-${cardUrgencyString.toLowerCase()}.svg`} alt="" height="18px"/>
            <p>{cardUrgencyString}</p>
        </div>
    )

}

export default CardUrgencyLabel;