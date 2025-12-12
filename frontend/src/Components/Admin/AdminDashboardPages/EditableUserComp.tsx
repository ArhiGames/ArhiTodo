import type { UserWithClaims } from "../../../Models/Administration/UserWithClaims.ts";

const EditableUserComp = (props: { user: UserWithClaims }) => {

    return (
        <div className="admin-editable-user">
            <span>
                <h2>{props.user.userName}</h2>
                <p style={{ fontStyle: "italic", opacity: "60%" }}>({props.user.email})</p>
            </span>
            <button>Edit</button>
        </div>
    )

}

export default EditableUserComp;