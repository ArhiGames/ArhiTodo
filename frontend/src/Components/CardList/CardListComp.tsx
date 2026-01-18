import type { CardGetDto } from "../../Models/BackendDtos/GetDtos/CardGetDto.ts";
import CardComp from "../Card/CardComp.tsx";
import type {Card, Checklist, ChecklistItem, State} from "../../Models/States/types.ts";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type { CardListGetDto } from "../../Models/BackendDtos/GetDtos/CardListGetDto.ts";
import CreateNewCardComp from "../Card/CreateNewCardComp.tsx";
import type {ChecklistGetDto} from "../../Models/BackendDtos/GetDtos/ChecklistGetDto.ts";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../config/api.ts";

const CardListComp = (props: { boardId: number, cardList: CardListGetDto, filteringLabels: number[] }) => {

    const { checkRefresh } = useAuth();
    const kanbanState: State = useKanbanState();
    const dispatch = useKanbanDispatch();
    const unnormalizedCards: CardGetDto[] = getUnnormalizedCards();

    const cardListHeaderRef = useRef<HTMLDivElement | null>(null);

    const editingNameInputRef = useRef<HTMLInputElement | null>(null);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [inputtedName, setInputtedName] = useState<string>(props.cardList.cardListName);

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

    const onChecklistNameChangeCommited = useCallback(async () => {
        if (inputtedName.length <= 0 || inputtedName === props.cardList.cardListName) return;

        const oldChecklistName: string = props.cardList.cardListName;

        if (dispatch) {
            dispatch({ type: "UPDATE_CARDLIST", payload: { cardListId: props.cardList.cardListId, cardListName: inputtedName } })
        }

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "UPDATE_CARDLIST", payload: { cardListId: props.cardList.cardListId, cardListName: oldChecklistName } })
            }
            return;
        }

        fetch(`${API_BASE_URL}/board/${props.boardId}/cardlist`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ cardListId: props.cardList.cardListId, cardListName: inputtedName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to update card list with id ${props.cardList.cardListId}`);
                }

                return res.json();
            })
            .then((updatedCardList: CardListGetDto) => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_CARDLIST", payload: { cardListId: props.cardList.cardListId, cardListName: updatedCardList.cardListName } })
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_CARDLIST", payload: { cardListId: props.cardList.cardListId, cardListName: oldChecklistName } })
                }
                console.error(err);
            })
    }, [checkRefresh, dispatch, inputtedName, props.boardId, props.cardList.cardListId, props.cardList.cardListName])

    useEffect(() => {

        if (isEditingName) {
            editingNameInputRef.current?.focus();
        }

        const onClickedOutside = (e: MouseEvent) => {
            e.stopPropagation();
            if (!cardListHeaderRef.current) return;

            if (!cardListHeaderRef.current.contains(e.target as Node)) {
                onChecklistNameChangeCommited().then();
                setIsEditingName(false);
            }
        }

        document.addEventListener("mousedown", onClickedOutside);

        return () => document.removeEventListener("mousedown", onClickedOutside);

    }, [isEditingName, onChecklistNameChangeCommited]);

    return (
        <div className="cardlist">
            <div className="cardlist-background">
                <div ref={cardListHeaderRef} className="cardlist-header">
                    {
                        isEditingName ? (
                            <input ref={editingNameInputRef} className="classic-input small" onBlur={onChecklistNameChangeCommited} maxLength={25}
                                   value={inputtedName} onChange={(e) => setInputtedName(e.target.value)}/>
                        ) : (
                            <h3 onClick={() => setIsEditingName(true)}>{props.cardList.cardListName}</h3>
                        )
                    }
                </div>
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

                        return <CardComp card={card} key={card.cardId}/>
                    })}
                </div>
                <CreateNewCardComp cardList={props.cardList}/>
            </div>
        </div>
    )
}

export default CardListComp;