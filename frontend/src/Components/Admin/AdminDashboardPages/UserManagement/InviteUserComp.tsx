import { useState } from "react";
import InvitationCreatorModalComp from "./InvitationCreatorModalComp.tsx";

const InviteUserComp = (props: { onInvitationViewClicked: () => void }) => {

    const [isCreatingInvitationLink, setIsCreatingInvitationLink] = useState<boolean>(false);

    function onCurrentLinksClicked() {

        props.onInvitationViewClicked();

    }

    return (
        <>
            <div className="invite-user">
                <button onClick={() => setIsCreatingInvitationLink(true)}>Create invitation</button>
                <button onClick={onCurrentLinksClicked}>View invitations</button>
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