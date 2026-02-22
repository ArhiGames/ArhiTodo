import type {Claim} from "../../../Models/Claim.ts";

export type SetProjectPermissionsPayload = {
    projectId: number;
    isOwner: boolean;
    isManager: boolean;
}

export type SetBoardPermissionsPayload = {
    boardId: number;
    isOwner: boolean;
    boardUserClaims: Claim[];
}

export type UserAction =
    { type: "SET_PROJECT_PERMISSION", payload: SetProjectPermissionsPayload } |
    { type: "SET_BOARD_PERMISSION", payload: SetBoardPermissionsPayload }