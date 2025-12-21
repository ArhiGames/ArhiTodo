import type { Claim } from "../../../../Models/Claim.ts";
import type { DefaultClaim } from "./Claims.ts";
import FancyToggleComp from "../../../../lib/FancyToggle/FancyToggleComp.tsx";
import { useState } from "react";

interface Props {
    claim: Claim | undefined;
    defaultClaim: DefaultClaim;
    canEdit: boolean;
    updatedClaims: Claim[];
    setUpdatedClaims: (value: Claim[]) => void;
}

const EditableClaimsComp = (props: Props) => {

    const [claimBooleanValue, setClaimBooleanValue] = useState<boolean>(props.claim?.value == "true");

    function onToggleValueChanged(newValue: boolean) {

        setClaimBooleanValue(newValue);

        const foundClaim: Claim | undefined = props.updatedClaims.find((predicate: Claim) => (predicate.type === props.defaultClaim.claimType));
        if (foundClaim) {
            const newClaims: Claim[] = props.updatedClaims.filter((predicate: Claim) => (predicate.type !== props.defaultClaim.claimType));
            props.setUpdatedClaims(newClaims);
        } else {
            const newClaims: Claim[] = [...props.updatedClaims, { type: props.defaultClaim.claimType, value: String(newValue) } ];
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