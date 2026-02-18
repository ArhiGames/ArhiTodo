import type { BoardGetDto } from "../../../Models/BackendDtos/Kanban/BoardGetDto.ts";
import type {Claim} from "../../../Models/Claim.ts";

export type InitProjectPayload = {
    projectId: number;
    projectName: string;
    ownedByUserId: string;
}

export type UpdateProjectPayload = {
    projectId: number;
    projectName: string;
}

export type SetProjectPermissionsPayload = {
    projectId: number;
    isManager: boolean;
}

export type InitBoardsPayload = {
    boardId: number;
    boardName: string;
    ownedByUserId: string;
}

export type InitBoardPayload = {
    boardId: number;
    boardGetDto: BoardGetDto;
}

export type CreateLabelPayload = {
    boardId: number;
    labelId: number;
    labelText: string;
    labelColor: number;
}

export type CreateLabelSucceededPayload = {
    predictedLabelId: number;
    actualLabelId: number;
}

export type ChangeLabelCardRelationPayload = {
    cardId: number;
    labelId: number;
}

export type UpdateLabelPayload = {
    labelId: number;
    labelText: string;
    labelColor: number;
}

export type CreateBoardPayload = {
    projectId: number;
    boardId: number;
    boardName: string;
    ownedByUserId: string;
}

export type CreateBoardSucceededPayload = {
    predictedBoardId: number;
    actualBoardId: number;
}

export type SetBoardPermissionsPayload = {
    boardId: number;
    boardUserClaims: Claim[];
}

export type UpdateBoardPayload = {
    boardId: number;
    boardName: string;
}

export type CreateCardlistPayload = {
    boardId: number;
    cardListId: number;
    cardListName: string;
}

export type CreateCardlistSucceededPayload = {
    predictedCardlistId: number;
    actualCardlistId: number;
}

export type UpdateCardlistPayload = {
    cardListId: number;
    cardListName: string;
}

export type CreateCardPayload = {
    cardListId: number;
    cardId: number;
    cardName: string;
}

export type CreateCardSucceededPayload = {
    predictedCardId: number;
    actualCardId: number;
}

export type UpdateCardNamePayload = {
    cardId: number;
    cardName: string;
}

export type UpdateCardStatePayload = {
    cardId: number;
    newState: boolean;
}

export type MoveCardPayload = {
    cardId: number;
    toCardListId: number;
    toIndex: number;
}

export type CreateChecklistPayload = {
    checklistId: number;
    checklistName: string;
    cardId: number;
}

export type CreateChecklistSucceededPayload = {
    predictedChecklistId: number;
    actualChecklistId: number;
}

export type UpdateChecklistPayload = {
    checklistId: number;
    checklistName: string;
}

export type CreateChecklistItemPayload = {
    checklistItemId: number;
    checklistItemName: string;
    checklistId: number;
}

export type CreateChecklistItemSucceededPayload = {
    predictedChecklistItemId: number;
    actualChecklistItemId: number;
}

export type UpdateChecklistItemPayload = {
    checklistItemId: number;
    checklistItemName: string;
    isDone: boolean;
}

export type UpdateChecklistItemStateAction = {
    checklistItemId: number;
    newState: boolean;
}

export type SetDraggingOverTargetPayload = {
    sourceId: number;
    sourceType: string;
    targetId: number;
    targetType: string;
}

export type Action =
    { type: "INIT_PROJECT", payload: InitProjectPayload } |
    { type: "INIT_PROJECTS", payload: InitProjectPayload[] } |
    { type: "UPDATE_PROJECT", payload: UpdateProjectPayload } |
    { type: "DELETE_PROJECT", payload: { projectId: number } } |
    { type: "SET_PROJECT_PERMISSION", payload: SetProjectPermissionsPayload } |

    { type: "INIT_BOARDS", payload: { projectId: number, boards: InitBoardsPayload[] }} |
    { type: "INIT_BOARD", payload: InitBoardPayload } |
    { type: "SET_BOARD_PERMISSION", payload: SetBoardPermissionsPayload } |

    { type: "CREATE_LABEL_OPTIMISTIC", payload: CreateLabelPayload } |
    { type: "CREATE_LABEL_SUCCEEDED", payload: CreateLabelSucceededPayload } |
    { type: "CREATE_LABEL_FAILED", payload: { labelToDelete: number } } |
    { type: "UPDATE_LABEL", payload: UpdateLabelPayload } |
    { type: "DELETE_LABEL", payload: { labelId: number } } |

    { type: "ADD_LABEL_TO_CARD_OPTIMISTIC", payload: ChangeLabelCardRelationPayload } |
    { type: "ADD_LABEL_TO_CARD_FAILED", payload: ChangeLabelCardRelationPayload } |
    { type: "REMOVE_LABEL_FROM_CARD", payload: ChangeLabelCardRelationPayload } |

    { type: "CREATE_BOARD_OPTIMISTIC", payload: CreateBoardPayload } |
    { type: "CREATE_BOARD_SUCCEEDED", payload: CreateBoardSucceededPayload } |
    { type: "CREATE_BOARD_FAILED", payload: { failedBoardId: number } } |

    { type: "UPDATE_BOARD", payload: UpdateBoardPayload } |
    { type: "DELETE_BOARD", payload: { boardId: number } } |

    { type: "CREATE_CARDLIST_OPTIMISTIC", payload: CreateCardlistPayload } |
    { type: "CREATE_CARDLIST_SUCCEEDED", payload: CreateCardlistSucceededPayload } |
    { type: "CREATE_CARDLIST_FAILED", payload: { failedCardlistId: number } } |
    { type: "DELETE_CARDLIST", payload: { cardListId: number } } |
    { type: "DELETE_CARDS_FROM_CARDLIST", payload: { fromCardListId: number } } |
    { type: "UPDATE_CARDLIST", payload: UpdateCardlistPayload } |

    { type: "CREATE_CARD_OPTIMISTIC", payload: CreateCardPayload } |
    { type: "CREATE_CARD_SUCCEEDED", payload: CreateCardSucceededPayload } |
    { type: "CREATE_CARD_FAILED", payload: { failedCardId: number } } |
    { type: "UPDATE_CARD_NAME", payload: UpdateCardNamePayload } |
    { type: "UPDATE_CARD_STATE", payload: UpdateCardStatePayload } |
    { type: "DELETE_CARD", payload: { cardId: number } } |
    { type: "MOVE_CARD", payload: MoveCardPayload } |

    { type: "CREATE_CHECKLIST_OPTIMISTIC", payload: CreateChecklistPayload } |
    { type: "CREATE_CHECKLIST_SUCCEEDED", payload: CreateChecklistSucceededPayload } |
    { type: "UPDATE_CHECKLIST", payload: UpdateChecklistPayload } |
    { type: "DELETE_CHECKLIST", payload: { checklistId: number } } |

    { type: "CREATE_CHECKLIST_ITEM_OPTIMISTIC", payload: CreateChecklistItemPayload } |
    { type: "CREATE_CHECKLIST_ITEM_SUCCEEDED", payload: CreateChecklistItemSucceededPayload } |
    { type: "DELETE_CHECKLIST_ITEM", payload: { checklistItemId: number } } |
    { type: "UPDATE_CHECKLIST_ITEM", payload: UpdateChecklistItemPayload } |
    { type: "CHANGE_CHECKLIST_ITEM_STATE", payload: UpdateChecklistItemStateAction } |

    { type: "SET_DRAGGING_TARGET_ID", payload: SetDraggingOverTargetPayload | null }