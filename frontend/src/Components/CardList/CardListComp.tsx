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
import {useRealtimeHub} from "../../Contexts/Realtime/Hooks.ts";
import {useCardsSearch} from "../../Contexts/Kanban/Cards/SearchCardsContexts.ts";

interface Props {
    cardListId: number;
    draggableHandleRef: (ref: HTMLDivElement | null) => void;
}

const CardListComp = (props: Props) => {

    const { checkRefresh } = useAuth();
    const kanbanState: KanbanState = useKanbanState();
    const dispatch = useKanbanDispatch();
    const { boardId } = useParams();
    const permission = usePermissions();
    const hubConnection = useRealtimeHub();
    const searchCards = useCardsSearch();

    const cardList: CardList | undefined = kanbanState.cardLists.get(props.cardListId);
    const cardListHeaderRef = useRef<HTMLDivElement | null>(null);

    const editingNameInputRef = useRef<HTMLInputElement | null>(null);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);
    const [inputtedName, setInputtedName] = useState<string>(cardList?.cardListName ?? "");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const editIconRef = useRef<HTMLImageElement | null>(null);

    const scrollDownElemRef = useRef<HTMLDivElement>(null);

    async function onEditCardListNameEnterPressed(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            editingNameInputRef.current?.blur();
            setIsEditingName(false);
        }
    }

    const onChecklistNameChangeCommited = useCallback(async () => {
        if (!cardList || inputtedName.length <= 0 || inputtedName === cardList.cardListName) return;
        editingNameInputRef.current?.blur();

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
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshedToken}`,
                "SignalR-Connection-Id": hubConnection.hubConnection?.connectionId ?? ""
            },
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
    }, [cardList, inputtedName, dispatch, checkRefresh, boardId, hubConnection.hubConnection?.connectionId, props.cardListId])

    function onTryEditCardListNameClicked() {
        if (!permission.hasManageCardListsPermission() || !cardList) return;
        setIsEditingName(true);
        setInputtedName(cardList.cardListName);
    }

    useEffect(() => {

        if (isEditingName) {
            editingNameInputRef.current?.focus();
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

    function onRenameCardListActionPressed() {
        setIsEditing(false);
        onTryEditCardListNameClicked();
    }

    function scrollDown() {
        scrollDownElemRef.current?.scrollIntoView({ block: "end", inline: "nearest", behavior: "smooth" });
    }

    function getCardsScrollerJsx() {
        const cards: Card[] | undefined = kanbanState.cardLists.get(props.cardListId)?.cardIds.map((cardId: number) => {
            return kanbanState.cards.get(cardId)!;
        });
        if (!cards) return null;

        function checkFilter(card: Card): boolean {
            if (!card.cardName.includes(searchCards.searchString)) return false;
            if (searchCards.filteringUrgencyLevels.length !== 0 &&
                !searchCards.filteringUrgencyLevels.includes(card.cardUrgencyLevel)) return false;
            if (searchCards.filteringLabels.length !== 0 &&
                !kanbanState.cardLabels.get(card.cardId)!.some((labelId: number) => searchCards.filteringLabels.includes(labelId))) return false;
            if (searchCards.filteringUserIds.length !== 0 &&
                !card.assignedUserIds.some((userId: string) => searchCards.filteringUserIds.includes(userId))) return false;
            return true;
        }

        const filteredCards: Card[] = cards.filter((card: Card) => checkFilter(card));

        return (
            <div className="cards scroller">
                <div>
                    {filteredCards.map((card: Card, index: number) => {
                        if (card.isDone) return null;
                        return <CardCompWrapper key={card.cardId} cardId={card.cardId} dndIndex={index}/>
                    })}
                </div>
                <div ref={scrollDownElemRef} className="scroll-down-shadow-elem"></div>
                {
                    filteredCards.some((card: Card) => card.isDone) && (
                        <div className="cardlist-un-completed-breaker">
                            <div className="cardlist-un-completed-breaker-filler"/>
                            <p>Completed</p>
                            <div className="cardlist-un-completed-breaker-filler"/>
                        </div>
                    )
                }
                <div>
                    {filteredCards.map((card: Card, index: number) => {
                        if (!card.isDone) return null;
                        return <CardCompWrapper key={card.cardId} cardId={card.cardId} dndIndex={index}/>
                    })}
                </div>
            </div>
        )
    }

    return (
        <>
            <div ref={props.draggableHandleRef} className="cardlist-draggable"/>
            <div className="cardlist-background">
                <div ref={cardListHeaderRef} className="cardlist-header">
                    {
                        isEditingName ? (
                            <input ref={editingNameInputRef} className="classic-input small" onBlur={onChecklistNameChangeCommited} maxLength={25}
                                   value={inputtedName} onChange={(e) => setInputtedName(e.target.value)}
                                   onKeyDown={onEditCardListNameEnterPressed}/>
                        ) : (
                            <>
                                <h3 onClick={onTryEditCardListNameClicked}>{cardList?.cardListName}</h3>
                                { (permission.hasManageCardsPermission() || permission.hasManageCardListsPermission()) && (
                                    <div className="cardlist-actions">
                                        <img ref={editIconRef} src="/edit-icon.svg" alt="Edit" height="24px" className="icon clickable"
                                             onClick={() => setIsEditing((prev: boolean) => !prev)}/>
                                        { isEditing && <CardListEditPopover cardListId={props.cardListId} startEditNameAction={onRenameCardListActionPressed}
                                                                            editIconRef={editIconRef} onClose={() => setIsEditing(false)}/>
                                        }
                                    </div>
                                )}
                            </>
                        )
                    }
                </div>
                { getCardsScrollerJsx() }
                { permission.hasManageCardsPermission() && <CreateNewCardComp cardListId={props.cardListId} scrollDown={scrollDown}/> }
            </div>
        </>
    )
}

export default CardListComp;