import Modal from "../../../../../lib/Modal/Default/Modal.tsx";
import type { InvitationLink } from "../../../../../Models/InvitationLink.ts";
import { useEffect, useState } from "react";
import { formatRemainingTime } from "../../../../../lib/Functions.ts";

interface Props {
    invitationLink: InvitationLink;
    onClosed: () => void;
}

const GeneratedLinkInfoComp = (props: Props) => {

    const origin = window.location.origin;
    const finalUrl = `${origin}/register/${props.invitationLink.invitationKey}`;
    const [copied, setCopied] = useState<boolean>(true);
    const expires: boolean = new Date(props.invitationLink.expiresDate).getTime() !== 0;
    // eslint-disable-next-line react-hooks/purity
    const [remainingMs, setRemainingMs] = useState<number>(new Date(props.invitationLink.expiresDate).getTime() - Date.now());

    useEffect(() => {
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
        <Modal onClosed={props.onClosed} header={<h2>Generated invitation link</h2>} modalSize="modal-small"
               footer={
                    <>
                        <button onClick={onCopyButtonPressed} className={`button ${copied ? "standard-button" : "valid-submit-button"}`}>{copied ? "Copied" : "Copy"}</button>
                        <button onClick={props.onClosed} className="button standard-button">Accept</button>
                    </>
               }>
            <div className="generated-invitation-link-body">
                <p className="generated-link-text">{finalUrl}</p>
                <p style={{ marginTop: "0.5rem" }} className="generated-link-active-for-text">
                    { !expires ? "Never expires..." : `Active for: ${formatRemainingTime(remainingMs)}`}</p>
            </div>
        </Modal>
    )

}

export default GeneratedLinkInfoComp;