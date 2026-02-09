import {defaultBoardClaims, type DefaultClaim} from "../../../lib/Claims.ts";
import BoardUserSelectorToggleComp from "./BoardUserSelectorToggleComp.tsx";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import type {Claim} from "../../../Models/Claim.ts";
import type {Dispatch, SetStateAction} from "react";

interface Props {
    updatedClaims: Claim[];
    setUpdatedClaims: Dispatch<SetStateAction<Claim[]>>
    currentViewingUser: UserGetDto;
}

const BoardUserSelectorEditUserClaimsComp = (props: Props) => {

    return (
        <>
            <div className="board-user-selector-user-information">
                <p style={{ fontWeight: "bold" }}>{props.currentViewingUser.userName}</p>
                <p style={{ opacity: "75%" }}>{props.currentViewingUser.email}</p>
            </div>
            <div className="board-user-selector-claims">
                {defaultBoardClaims.map((defaultClaim: DefaultClaim) => {
                    return <BoardUserSelectorToggleComp updatedClaims={props.updatedClaims} setUpdatedClaims={props.setUpdatedClaims}
                                                        defaultClaim={defaultClaim} key={defaultClaim.claimType}
                                                        claim={props.currentViewingUser.boardUserClaims.find(buc => buc.claimType === defaultClaim.claimType)}/>;
                })}
            </div>
        </>
    )

}

export default BoardUserSelectorEditUserClaimsComp;