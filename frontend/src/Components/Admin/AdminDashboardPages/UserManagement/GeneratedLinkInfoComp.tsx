import Modal from "../../../../lib/Modal/Default/Modal.tsx";
import type { InvitationLink } from "../../../../Models/InvitationLink.ts";
import {useEffect, useState} from "react";

interface Props {
    invitationLink: InvitationLink;
    onClosed: () => void;
}

const GeneratedLinkInfoComp = (props: Props) => {

    const origin = window.location.origin;
    const finalUrl = `${origin}/register/${props.invitationLink.invitationKey}`;
    const [copied, setCopied] = useState<boolean>(true);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCopied(false);

    }, [props]);

    async function onCopyButtonPressed() {

        await navigator.clipboard.writeText(finalUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

    }

    return (
        <Modal onClosed={props.onClosed} title="Generated invitation link" modalSize="modal-small"
               footer={
                    <button onClick={props.onClosed} className="button standard-button">Accept</button>
               }>
            <div className="generated-invitation-link-body">
                <div className="generated-invitation-link-div">
                    <p className="generated-link-text">{finalUrl}</p>
                    <button onClick={onCopyButtonPressed} className={`button ${copied ? "standard-button" : "valid-submit-button"}`}>{copied ? "Copied" : "Copy"}</button>
                </div>
            </div>
        </Modal>
    )

}

export default GeneratedLinkInfoComp;