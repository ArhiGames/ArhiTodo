import type { State } from "../../../../../Models/States/types.ts";
import type { CreateLabelPayload } from "../../Action.ts";

const createLabelAction = (state: State, payload: CreateLabelPayload) => {

    return {
        ...state,
        labels: {
            ...state.labels,
            [payload.labelId]: {
                boardId: payload.boardId,
                labelId: payload.labelId,
                labelText: payload.labelText,
                labelColor: payload.labelColor
            }
        }
    }

}

export default createLabelAction;