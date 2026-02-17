import type {CardList, Label, State} from "../../../../Models/States/types.ts";
import cleanCardListAction from "./cleanCardListAction.ts";

const cleanBoardAction = (state: State, boardIds: number[]) => {
    const newLabels: Map<number, Label> = new Map(state.labels);
    const newCardLists: Map<number, CardList> = new Map(state.cardLists);

    const listIdsToDelete = Array.from(state.cardLists.values())
        .filter(cl => boardIds.includes(cl.boardId))
        .map(cl => cl.cardListId);

    const labelIdsToDelete = Array.from(state.labels.values())
        .filter(l => boardIds.includes(l.boardId))
        .map(l => l.labelId);

    const cardLabelIdsToDelete = Array.from(state.cardLabels.values())
        .filter(cardId => state.cardLabels.get(Number(cardId))?.some(l => labelIdsToDelete.includes(l)))
        .map(cardId => Number(cardId));

    const { newCards, newCardLabels, newChecklists, newChecklistItems } = cleanCardListAction(state, listIdsToDelete);

    listIdsToDelete.forEach(id => newCardLists.delete(id));
    labelIdsToDelete.forEach(id => newLabels.delete(id))
    cardLabelIdsToDelete.forEach(id => newCardLabels.delete(id));

    return { newCardLists: newCardLists, newCards: newCards, newLabels: newLabels,
        newCardLabels: newCardLabels, newChecklists: newChecklists, newChecklistItems: newChecklistItems };
}

export default cleanBoardAction;