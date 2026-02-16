import type {CardList, Label, State} from "../../../../Models/States/types.ts";
import cleanCardListAction from "./cleanCardListAction.ts";

const cleanBoardAction = (state: State, boardIds: number[]) => {
    const newLabels: Record<number, Label> = state.labels;
    const newCardLists: Record<number, CardList> = state.cardLists;

    const listIdsToDelete = Object.values(state.cardLists)
        .filter(cl => boardIds.includes(cl.boardId))
        .map(cl => cl.cardListId);

    const labelIdsToDelete = Object.values(state.labels)
        .filter(l => boardIds.includes(l.boardId))
        .map(l => l.labelId);

    const cardLabelIdsToDelete = Object.keys(state.cardLabels)
        .filter(cardId => state.cardLabels[Number(cardId)].some(l => labelIdsToDelete.includes(l)))
        .map(cardId => Number(cardId));

    const { newCards, newCardLabels, newChecklists, newChecklistItems } = cleanCardListAction(state, listIdsToDelete);

    listIdsToDelete.forEach(id => delete newCardLists[id]);
    labelIdsToDelete.forEach(id => delete newLabels[id])
    cardLabelIdsToDelete.forEach(id => delete newCardLabels[id]);

    return { newCardLists: newCardLists, newCards: newCards, newLabels: newLabels,
        newCardLabels: newCardLabels, newChecklists: newChecklists, newChecklistItems: newChecklistItems };
}

export default cleanBoardAction;