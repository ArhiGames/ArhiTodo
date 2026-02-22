import type {Claim} from "../Claim.ts";

export type ProjectPermission = {
    projectId: number;
    isProjectOwner: boolean;
    isManager: boolean;
}

export type BoardPermission = {
    boardId: number;
    isBoardOwner: boolean;
    boardUserClaims: Claim[];
}

export interface UserState {
    projectPermission: Map<number, ProjectPermission>;
    boardPermissions: Map<number, BoardPermission>;
}