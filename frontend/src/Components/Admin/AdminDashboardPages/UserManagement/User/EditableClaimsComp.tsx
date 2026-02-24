import type { Claim } from "../../../../../Models/Claim.ts";
import type { DefaultClaim } from "../../../../../lib/Claims.ts";
import FancyToggleComp from "../../../../../lib/FancyToggle/FancyToggleComp.tsx";
import { useState } from "react";

interface Props {
    claim: Claim | undefined;
    defaultClaim: DefaultClaim;
    canEdit: boolean;
    updatedClaims: Claim[];
    setUpdatedClaims: (value: Claim[]) => void;
}

const EditableClaimsComp = (props: Props) => {

    const [claimBooleanValue, setClaimBooleanValue] = useState<boolean>(props.claim?.claimValue == "True");

    function onToggleValueChanged(newValue: boolean) {

        setClaimBooleanValue(newValue);

        const foundClaim: Claim | undefined = props.updatedClaims.find((predicate: Claim) => (predicate.claimType === props.defaultClaim.claimType));
        if (foundClaim) {
            const newClaims: Claim[] = props.updatedClaims.filter((predicate: Claim) => (predicate.claimType !== props.defaultClaim.claimType));
            props.setUpdatedClaims(newClaims);
        } else {
            const newClaims: Claim[] = [...props.updatedClaims, { claimType: props.defaultClaim.claimType, claimValue: newValue ? "True" : "False" } ];
            props.setUpdatedClaims(newClaims);
        }

    }

    return (
        <div className="editable-claim">
            <div>
                <p>{props.defaultClaim.claimName}</p>
                <p style={{ fontStyle: "italic", opacity: "75%"} }>{props.defaultClaim.claimDescription}</p>
            </div>
            { props.canEdit ? <FancyToggleComp checked={claimBooleanValue} setChecked={onToggleValueChanged}/> : null }
        </div>
    )

}

export default EditableClaimsComp;