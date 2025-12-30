import type { CardGetDto } from "../../Models/BackendDtos/GetDtos/CardGetDto.ts";
import CardComp from "../Card/CardComp.tsx";
import type { Card, State } from "../../Models/States/types.ts";
import { useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import type { CardListGetDto } from "../../Models/BackendDtos/GetDtos/CardListGetDto.ts";
import CreateNewCardComp from "../Card/CreateNewCardComp.tsx";

const CardListComp = (props: { boardId: number, cardList: CardListGetDto, filteringLabels: number[] }) => {

    const kanbanState: State = useKanbanState();
    const unnormalizedCards: CardGetDto[] = getUnnormalizedCards();

    function getLabelsForCard(toGetCardId: number) {
        const labels: { labelId: number }[] = [];

        Object.keys(kanbanState.cardLabels).forEach((cardId) => {
            if (toGetCardId === Number(cardId)) {
                const labelIds: number[] = kanbanState.cardLabels[toGetCardId];
                for (const labelId of labelIds) {
                    labels.push({ labelId: labelId })
                }
            }
        })

        return labels;
    }

    function getUnnormalizedCards() {

        const newUnnormalizedCards: CardGetDto[] = [];
        for (let i: number = 0; i < Object.values(kanbanState.cards).length; i++) {
            const card: Card = Object.values(kanbanState.cards)[i];
            if (card.cardListId === props.cardList.cardListId) {
                newUnnormalizedCards.push({
                    cardId: card.cardId,
                    cardName: card.cardName,
                    labels: getLabelsForCard(card.cardId)
                })
            }
        }
        return newUnnormalizedCards;

    }

    return (
        <div className="cardlist">
            <div className="cardlist-background">
                <h3>{props.cardList.cardListName}</h3>
                <div className="cards">
                    {unnormalizedCards.map((card: CardGetDto) => {
                        let contains: boolean = props.filteringLabels.length === 0;
                        for (const filteringLabelId of props.filteringLabels) {
                            if (card.labels.some( ({ labelId }: { labelId: number }) => labelId === filteringLabelId)) {
                                contains = true;
                                break;
                            }
                        }
                        if (!contains) return null;

                        return (
                            <CardComp card={card} key={card.cardId}/>
                        )
                    })}
                </div>
                <CreateNewCardComp cardList={props.cardList}/>
            </div>
        </div>
    )
}

export default CardListComp;