import type {Claim} from "../../../../Models/Claim.ts";

const EditableClaimsComp = (props: { claim: Claim, id: number }) => {

    return (
        <div className="editable-claim" key={props.id}>
            <h2>{props.claim.type} : {props.claim.value}</h2>
        </div>
    )

}

export default EditableClaimsComp;