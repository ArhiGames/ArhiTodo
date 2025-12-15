import { useState } from "react";
import InvitationCreatorModalComp from "./InvitationCreatorModalComp.tsx";

const InviteUserComp = () => {

    const [isCreatingInvitationLink, setIsCreatingInvitationLink] = useState<boolean>(false);

    return (
        <>
            <div onClick={() => setIsCreatingInvitationLink(true)} className="invite-user">
                <h2>Invite users</h2>
                <p>+</p>
                <button>Invitations</button>
            </div>
            {
                isCreatingInvitationLink && (
                    <InvitationCreatorModalComp onClose={() => setIsCreatingInvitationLink(false)}/>
                )
            }
        </>
    )

}

export default InviteUserComp;