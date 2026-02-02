import type {DefaultClaim} from "../../../lib/Claims.ts";
import FancyToggleComp from "../../../lib/FancyToggle/FancyToggleComp.tsx";
import {type Dispatch, type SetStateAction, useState} from "react";
import type {Claim} from "../../../Models/Claim.ts";

interface Props {
    updatedClaims: Claim[];
    setUpdatedClaims: Dispatch<SetStateAction<Claim[]>>
    defaultClaim: DefaultClaim;
    claim: Claim | undefined;
}

const BoardUserSelectorToggleComp = (props: Props) => {

    const [checked, setChecked] = useState<boolean>(props.claim?.claimValue === "true");

    function onCheckedStateChanged(newState: boolean) {

        if (props.updatedClaims.find((c: Claim) => c.claimType === props.defaultClaim.claimType)) {
            props.setUpdatedClaims(props.updatedClaims.filter(uc => uc.claimType !== props.defaultClaim.claimType))
        } else {
            props.setUpdatedClaims([...props.updatedClaims, { claimType: props.defaultClaim.claimType, claimValue: String(newState) } ])
        }

        setChecked(newState);
    }

    return (
        <div className="board-user-selector-toggle">
            <div>
                <p style={{ fontWeight: "bold" }}>{props.defaultClaim.claimName}</p>
                <p style={{ opacity: "75%" }}>{props.defaultClaim.claimDescription}</p>
            </div>
            <FancyToggleComp checked={checked} setChecked={onCheckedStateChanged}/>
        </div>
    )

}

export default BoardUserSelectorToggleComp;