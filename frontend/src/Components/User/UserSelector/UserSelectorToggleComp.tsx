import type {DefaultClaim} from "../../../lib/Claims.ts";
import FancyToggleComp from "../../../lib/FancyToggle/FancyToggleComp.tsx";
import {useState} from "react";

interface Props {
    defaultClaim: DefaultClaim;
}

const UserSelectorToggleComp = (props: Props) => {

    const [checked, setChecked] = useState<boolean>(false);

    return (
        <div className="user-selector-toggle">
            <div>
                <p style={{ fontWeight: "bold" }}>{props.defaultClaim.claimName}</p>
                <p style={{ opacity: "75%" }}>{props.defaultClaim.claimDescription}</p>
            </div>
            <FancyToggleComp checked={checked} setChecked={setChecked}></FancyToggleComp>
        </div>
    )

}

export default UserSelectorToggleComp;