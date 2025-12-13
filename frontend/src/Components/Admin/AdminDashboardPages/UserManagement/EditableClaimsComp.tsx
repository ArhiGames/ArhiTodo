import type { Claim } from "../../../../Models/Claim.ts";
import type { DefaultClaim } from "./Claims.ts";
import FancyToggleComp from "../../../../lib/FancyToggle/FancyToggleComp.tsx";
import { useState } from "react";

const EditableClaimsComp = (props: { claim: Claim | undefined, defaultClaim: DefaultClaim }) => {

    const [claimBooleanValue, setClaimBooleanValue] = useState<boolean>(props.claim?.value == "true");

    return (
        <div className="editable-claim">
            <div>
                <p>{props.defaultClaim.claimName}</p>
                <p style={{ fontStyle: "italic", opacity: "75%"} }>{props.defaultClaim.claimDescription}</p>
            </div>
            <div>
                <FancyToggleComp checked={claimBooleanValue} setChecked={setClaimBooleanValue}></FancyToggleComp>
            </div>
        </div>
    )

}

export default EditableClaimsComp;