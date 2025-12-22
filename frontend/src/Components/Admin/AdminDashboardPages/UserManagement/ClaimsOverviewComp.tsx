import { defaultAppClaims, type DefaultClaim } from "./Claims"
import type { Claim } from "../../../../Models/Claim.ts";
import EditableClaimsComp from "./EditableClaimsComp.tsx";
import type { UserWithClaims } from "../../../../Models/Administration/UserWithClaims.ts";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";

interface Props {
    currentViewingUser: UserWithClaims;
    updatedClaims: Claim[];
    setUpdatedClaims: (claims: Claim[]) => void;
}

const ClaimsOverviewComp = (props: Props) => {

    const { appUser } = useAuth();

    const isSelf = appUser?.id === props.currentViewingUser.userId;

    return (
        <div className="editable-claims-div">
            { defaultAppClaims.claim.map((defaultClaim: DefaultClaim, index: number) => (
                <EditableClaimsComp defaultClaim={defaultClaim}
                                    claim={props.currentViewingUser.userClaims.find((claim: Claim) => claim.type == defaultClaim.claimType)}
                                    canEdit={props.currentViewingUser.userName !== "admin" && !isSelf}
                                    updatedClaims={props.updatedClaims} setUpdatedClaims={props.setUpdatedClaims}
                                    key={index}/>
            )) }
        </div>

    )

}

export default ClaimsOverviewComp;