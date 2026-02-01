import {defaultBoardClaims, type DefaultClaim} from "../../../lib/Claims.ts";
import UserSelectorToggleComp from "./UserSelectorToggleComp.tsx";
import type {UserGetDto} from "../../../Models/BackendDtos/Auth/UserGetDto.ts";
import type {Claim} from "../../../Models/Claim.ts";
import type {Dispatch, SetStateAction} from "react";

interface Props {
    updatedClaims: Claim[];
    setUpdatedClaims: Dispatch<SetStateAction<Claim[]>>
    currentViewingUser: UserGetDto;
}

const UserSelectorEditUserClaimsComp = (props: Props) => {

    return (
        <>
            <div className="user-selector-user-information">
                <p style={{ fontWeight: "bold" }}>{props.currentViewingUser.userName}</p>
                <p style={{ opacity: "75%" }}>{props.currentViewingUser.email}</p>
            </div>
            <div className="user-selector-claims">
                {defaultBoardClaims.map((defaultClaim: DefaultClaim) => {
                    return <UserSelectorToggleComp updatedClaims={props.updatedClaims} setUpdatedClaims={props.setUpdatedClaims}
                                                   defaultClaim={defaultClaim}
                                                   claim={props.currentViewingUser.boardUserClaims.find(buc => buc.claimType === defaultClaim.claimType)}/>;
                })}
            </div>
        </>
    )

}

export default UserSelectorEditUserClaimsComp;