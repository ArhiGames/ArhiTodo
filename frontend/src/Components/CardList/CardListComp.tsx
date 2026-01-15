import type { CardGetDto } from "../../Models/BackendDtos/GetDtos/CardGetDto.ts";
import CardComp from "../Card/CardComp.tsx";
import type {Card, Checklist, ChecklistItem, State} from "../../Models/States/types.ts";
import { useKanbanState } from "../../Contexts/Kanban/Hooks.ts";
import type { CardListGetDto } from "../../Models/BackendDtos/GetDtos/CardListGetDto.ts";
import CreateNewCardComp from "../Card/CreateNewCardComp.tsx";
import type {ChecklistGetDto} from "../../Models/BackendDtos/GetDtos/ChecklistGetDto.ts";

const CardListComp = (props: { boardId: number, cardList: CardListGetDto, filteringLabels: number[] }) => {

    const kanbanState: State = useKanbanState();
    const unnormalizedCards: CardGetDto[] = getUnnormalizedCards();

    function getLabelsForCard(toGetCardId: number) {
        const labels: number[] = [];

        Object.keys(kanbanState.cardLabels).forEach((cardId) => {
            if (toGetCardId === Number(cardId)) {
                const labelIds: number[] = kanbanState.cardLabels[toGetCardId];
                for (const labelId of labelIds) {
                    labels.push(labelId);
                }
            }
        })

        return labels;
    }

    function getChecklistsForCard(toGetCardId: number) {
        const checklists: ChecklistGetDto[] = [];

        Object.values(kanbanState.checklists).forEach((checklist: Checklist) => {
            if (toGetCardId === checklist.cardId) {
                const createdChecklist: ChecklistGetDto = {
                    checklistId: checklist.checklistId,
                    checklistName: checklist.checklistName,
                    checklistItems: []
                };
                Object.values(kanbanState.checklistItems).forEach((checklistItem: ChecklistItem) => {
                    if (checklistItem.checklistId === checklist.checklistId) {
                        createdChecklist.checklistItems.push({
                            checklistItemId: checklistItem.checklistItemId,
                            checklistItemName: checklistItem.checklistItemName,
                            isDone: checklistItem.isDone
                        })
                    }
                })
                checklists.push(createdChecklist);
            }
        })

        return checklists;
    }

    function getUnnormalizedCards() {

        const newUnnormalizedCards: CardGetDto[] = [];
        for (let i: number = 0; i < Object.values(kanbanState.cards).length; i++) {
            const card: Card = Object.values(kanbanState.cards)[i];
            if (card.cardListId === props.cardList.cardListId) {
                newUnnormalizedCards.push({
                    cardId: card.cardId,
                    cardName: card.cardName,
                    isDone: card.isDone,
                    labelIds: getLabelsForCard(card.cardId),
                    checklists: getChecklistsForCard(card.cardId)
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
                            if (card.labelIds.some((labelId: number) => labelId === filteringLabelId)) {
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