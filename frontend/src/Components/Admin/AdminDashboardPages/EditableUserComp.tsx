import type { UserWithClaims } from "../../../Models/Administration/UserWithClaims.ts";
import type { Claim } from "../../../Models/Claim.ts";
import EditableClaimsComp from "./UserManagement/EditableClaimsComp.tsx";

const EditableUserComp = (props: { user: UserWithClaims }) => {

    return (
        <div className="admin-editable-user" key={props.user.userId}>
            <h2>{props.user.userName}</h2>
            <div className="admin-editable-user-claims">
                { props.user.userClaims.map((claim: Claim, index: number)=> (
                    <EditableClaimsComp claim={claim} id={index}/>
                )) }
            </div>
        </div>
    )

}

export default EditableUserComp;