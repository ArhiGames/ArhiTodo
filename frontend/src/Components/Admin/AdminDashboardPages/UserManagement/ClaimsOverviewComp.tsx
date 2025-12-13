import { defaultAppClaims, type DefaultClaim } from "./Claims"
import type { Claim } from "../../../../Models/Claim.ts";
import EditableClaimsComp from "./EditableClaimsComp.tsx";
import type { UserWithClaims } from "../../../../Models/Administration/UserWithClaims.ts";

interface Props {
    currentViewingUser: UserWithClaims;
    updatedClaims: Claim[];
    setUpdatedClaims: (claims: Claim[]) => void;
}

const ClaimsOverviewComp = (props: Props) => {

    return (
        <div className="editable-claims-div">
            { defaultAppClaims.claim.map((defaultClaim: DefaultClaim, index: number) => (
                <EditableClaimsComp defaultClaim={defaultClaim}
                                    claim={props.currentViewingUser.userClaims.find((claim: Claim) => claim.type == defaultClaim.claimType)}
                                    updatedClaims={props.updatedClaims} setUpdatedClaims={props.setUpdatedClaims}
                                    key={index}/>
            )) }
        </div>

    )

}

export default ClaimsOverviewComp;