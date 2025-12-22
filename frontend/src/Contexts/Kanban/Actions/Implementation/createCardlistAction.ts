import type {State} from "../../../../Models/States/types.ts";
import type {CreateCardlistPayload} from "../Action.ts";

const createCardlistAction = (state: State, payload: CreateCardlistPayload) => {

    return {
        ...state
    }

}

export default createCardlistAction;