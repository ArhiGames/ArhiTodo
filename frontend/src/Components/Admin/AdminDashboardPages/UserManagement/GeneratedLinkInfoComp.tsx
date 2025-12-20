import Modal from "../../../../lib/Modal/Default/Modal.tsx";
import type { InvitationLink } from "../../../../Models/InvitationLink.ts";
import { useEffect, useState } from "react";
import { formatRemainingTime } from "../../../../lib/Functions.ts";

interface Props {
    invitationLink: InvitationLink;
    onClosed: () => void;
}

const GeneratedLinkInfoComp = (props: Props) => {

    const origin = window.location.origin;
    const finalUrl = `${origin}/register/${props.invitationLink.invitationKey}`;
    const [copied, setCopied] = useState<boolean>(true);
    const [remainingMs, setRemainingMs] = useState<number>(0);

    useEffect(() => {

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCopied(false);

    }, [props]);

    useEffect(() => {

        const interval = setInterval(() => {
            setRemainingMs(
                new Date(props.invitationLink.expiresDate).getTime() - Date.now()
            );
        }, 1000);

        return () => clearInterval(interval);

    }, [props.invitationLink.expiresDate]);

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
                <p style={{ marginTop: "0.5rem" }} className="generated-link-active-for-text">
                    { new Date(props.invitationLink.expiresDate).getTime() - new Date(props.invitationLink.createdDate).getTime() === 0 ?
                         "Never expires..." : `Active for: ${formatRemainingTime(remainingMs)}`}</p>
            </div>
        </Modal>
    )

}

export default GeneratedLinkInfoComp;