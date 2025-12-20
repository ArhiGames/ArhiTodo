import { useState } from "react";
import InvitationCreatorModalComp from "./InvitationCreatorModalComp.tsx";

const InviteUserComp = (props: { onInvitationViewClicked: () => void }) => {

    const [isCreatingInvitationLink, setIsCreatingInvitationLink] = useState<boolean>(false);

    function onCurrentLinksClicked(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {

        e.stopPropagation();
        props.onInvitationViewClicked();

    }

    return (
        <>
            <div onClick={() => setIsCreatingInvitationLink(true)} className="invite-user">
                <h2>Invite users</h2>
                <p>+</p>
                <a onClick={onCurrentLinksClicked} style={{ textDecoration: "underline" }}>Invitations</a>
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