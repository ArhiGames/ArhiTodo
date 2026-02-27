interface Props {
    cardUrgencyLevel: number
    onClick?: React.MouseEventHandler<HTMLDivElement>
    ref?: React.RefObject<HTMLDivElement | null>
}

const CardUrgencyLabel = ({ cardUrgencyLevel, onClick, ref } : Props) => {

    if (cardUrgencyLevel < 0 || cardUrgencyLevel >= 5) return null;
    const cardUrgencyString: string = ["No priority", "Low", "Medium", "High", "Urgent"][cardUrgencyLevel];

    return (
        <div ref={ref} onClick={onClick} className={`card-urgency-label ${onClick ? "clickable" : ""}`}>
            <img className={`card-urgency-imgsvg ${cardUrgencyString.toLowerCase()}`}
                 src={`/urgency-${cardUrgencyString.replace(" ", "-").toLowerCase()}.svg`} alt="" height="18px"/>
            <p>{cardUrgencyString}</p>
        </div>
    )

}

export default CardUrgencyLabel;