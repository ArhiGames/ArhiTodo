import { useState } from "react";
import InvitationCreatorModalComp from "./InvitationCreatorModalComp.tsx";
import type {InvitationLink} from "../../../../../Models/InvitationLink.ts";

interface Props {
    onInvitationLinkGenerated: (invitationLink: InvitationLink) => void;
}

const InviteUserComp = (props: Props) => {

    const [isCreatingInvitationLink, setIsCreatingInvitationLink] = useState<boolean>(false);

    return (
        <>
            <button className="button standard-button" style={{ minHeight: "2.5rem" }} onClick={() => setIsCreatingInvitationLink(true)}>Invite</button>
            {
                isCreatingInvitationLink && (
                    <InvitationCreatorModalComp onInvitationLinkGenerated={props.onInvitationLinkGenerated}
                                                onClose={() => setIsCreatingInvitationLink(false)}/>
                )
            }
        </>
    )

}

export default InviteUserComp;