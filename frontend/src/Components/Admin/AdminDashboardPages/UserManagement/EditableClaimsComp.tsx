import type { Claim } from "../../../../Models/Claim.ts";
import type { DefaultClaim } from "./Claims.ts";

const EditableClaimsComp = (props: { claim: Claim | undefined, defaultClaim: DefaultClaim }) => {

    return (
        <div className="editable-claim">
            <div>
                <p>{props.defaultClaim.claimName}</p>
                <p style={{ fontStyle: "italic", opacity: "75%"} }>{props.defaultClaim.claimDescription}</p>
            </div>
            { props.defaultClaim.claimDatatype === "boolean" ? (
                <div>
                    <input className="checkbox" type="checkbox" checked={props.claim?.value === "true"}/>
                </div>
            ) : (
                <h2>Not a valid claim datatype</h2>
            )}
        </div>
    )

}

export default EditableClaimsComp;