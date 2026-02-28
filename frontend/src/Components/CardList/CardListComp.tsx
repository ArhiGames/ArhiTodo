import type {Card, CardList, KanbanState} from "../../Models/States/KanbanState.ts";
import {useKanbanDispatch, useKanbanState} from "../../Contexts/Kanban/Hooks.ts";
import type {CardListGetDto} from "../../Models/BackendDtos/Kanban/CardListGetDto.ts";
import CreateNewCardComp from "../Card/CreateNewCardComp.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {API_BASE_URL} from "../../config/api.ts";
import CardListEditPopover from "./CardListEditPopover.tsx";
import "./CardList.css"
import {useParams} from "react-router-dom";
import {usePermissions} from "../../Contexts/Authorization/usePermissions.ts";
import CardCompWrapper from "../Card/CardCompWrapper.tsx";

const CardListComp = (props: { cardListId: number, filteringLabels: number[] }) => {

    const { checkRefresh } = useAuth();
    const kanbanState: KanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { boardId } = useParams();
    const permission = usePermissions();

    const cardList: CardList | undefined = kanbanState.cardLists.get(props.cardListId);
    const cardListHeaderRef = useRef<HTMLDivElement | null>(null);

    const editingNameInputRef = useRef<HTMLInputElement | null>(null);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [inputtedName, setInputtedName] = useState<string>(cardList?.cardListName ?? "");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const editIconRef = useRef<HTMLImageElement | null>(null);

    const onChecklistNameChangeCommited = useCallback(async () => {
        if (!cardList || inputtedName.length <= 0 || inputtedName === cardList.cardListName) return;

        const oldChecklistName: string = cardList.cardListName;

        if (dispatch) {
            dispatch({ type: "UPDATE_CARDLIST", payload: { cardListId: props.cardListId, cardListName: inputtedName } })
        }

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) {
            if (dispatch) {
                dispatch({ type: "UPDATE_CARDLIST", payload: { cardListId: props.cardListId, cardListName: oldChecklistName } })
            }
            return;
        }

        fetch(`${API_BASE_URL}/board/${Number(boardId)}/cardlist`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ cardListId: props.cardListId, cardListName: inputtedName })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to update card list with id ${props.cardListId}`);
                }

                return res.json();
            })
            .then((updatedCardList: CardListGetDto) => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_CARDLIST", payload: { cardListId: props.cardListId, cardListName: updatedCardList.cardListName } })
                }
            })
            .catch(err => {
                if (dispatch) {
                    dispatch({ type: "UPDATE_CARDLIST", payload: { cardListId: props.cardListId, cardListName: oldChecklistName } })
                }
                console.error(err);
            })
    }, [cardList, inputtedName, dispatch, checkRefresh, boardId, props.cardListId])

    function onTryEditCardListNameClicked() {
        if (!permission.hasManageCardListsPermission() || !cardList) return;
        setIsEditingName(true);
        setInputtedName(cardList.cardListName);
    }

    useEffect(() => {

        if (isEditingName) {
            editingNameInputRef.current?.focus();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsEditing(false);
        }

        const onClickedOutside = (e: MouseEvent) => {
            e.stopPropagation();
            if (!isEditingName) return;
            if (!cardListHeaderRef.current) return;

            if (!cardListHeaderRef.current.contains(e.target as Node)) {
                onChecklistNameChangeCommited().then();
                setIsEditingName(false);
            }
        }

        document.addEventListener("mousedown", onClickedOutside);

        return () => document.removeEventListener("mousedown", onClickedOutside);

    }, [isEditingName, onChecklistNameChangeCommited]);

    function getCardsFilteredCards() {
        const cardIds: { cardId: number, isDone: boolean }[] = [];
        kanbanState.cardLists.get(props.cardListId)?.cardIds.forEach((cardId: number) => {
            const card: Card | undefined = kanbanState.cards.get(cardId);
            if (!card) return;

            const labelIds: number[] | undefined = kanbanState.cardLabels.get(cardId);
            if (!labelIds) return;

            if (props.filteringLabels.length > 0) {
                if (labelIds.some((labelId: number) => props.filteringLabels.includes(labelId))) {
                    cardIds.push({ cardId, isDone: card.isDone });
                    return;
                }
            } else {
                cardIds.push({ cardId, isDone: card.isDone });
            }
        })
        return cardIds;
    }

    function getCardsScrollerJsx() {
        const filteredCards: { cardId: number, isDone: boolean }[] = getCardsFilteredCards();

        return (
            <div className="cards scroller">
                <div>
                    {filteredCards.map(({ cardId, isDone }: { cardId: number, isDone: boolean }, index: number) => {
                        if (isDone) return null;
                        return <CardCompWrapper key={cardId} cardId={cardId} dndIndex={index}/>
                    })}
                </div>
                {
                    filteredCards.some((fl: { cardId: number, isDone: boolean }) => fl.isDone) && (
                        <div className="cardlist-un-completed-breaker">
                            <div className="cardlist-un-completed-breaker-filler"/>
                            <p>Completed</p>
                            <div className="cardlist-un-completed-breaker-filler"/>
                        </div>
                    )
                }
                <div>
                    {filteredCards.map(({ cardId, isDone }: { cardId: number, isDone: boolean }, index: number) => {
                        if (!isDone) return null;
                        return <CardCompWrapper key={cardId} cardId={cardId} dndIndex={index}/>
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="cardlist">
            <div className="cardlist-background">
                <div ref={cardListHeaderRef} className="cardlist-header">
                    {
                        isEditingName ? (
                            <input ref={editingNameInputRef} className="classic-input small" onBlur={onChecklistNameChangeCommited} maxLength={25}
                                   value={inputtedName} onChange={(e) => setInputtedName(e.target.value)}/>
                        ) : (
                            <>
                                <h3 onClick={onTryEditCardListNameClicked}>{cardList?.cardListName}</h3>
                                { (permission.hasManageCardsPermission() || permission.hasManageCardListsPermission()) && (
                                    <div className="cardlist-actions">
                                        <img ref={editIconRef} src="/edit-icon.svg" alt="Edit" height="24px"
                                             onClick={() => setIsEditing((prev: boolean) => !prev)}/>
                                        { isEditing && <CardListEditPopover cardListId={props.cardListId}
                                                                            editIconRef={editIconRef} onClose={() => setIsEditing(false)}/>
                                        }
                                    </div>
                                )}
                            </>
                        )
                    }
                </div>
                { getCardsScrollerJsx() }
                { permission.hasManageCardsPermission() && <CreateNewCardComp cardListId={props.cardListId}/> }
            </div>
        </div>
    )
}

export default CardListComp;