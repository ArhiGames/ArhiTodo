import type {State} from "../../../../../Models/States/types.ts";

const deleteBoardAction = (state: State, deleteBoardId: number) => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [deleteBoardId]: _, ...newBoards } = state.boards;

    return {
        ...state,
        boards: newBoards
    }

}

export default deleteBoardAction;