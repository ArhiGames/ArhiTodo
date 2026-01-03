import { useEffect, useState } from "react";
import type { InvitationLink } from "../../../../Models/InvitationLink.ts";
import { useAuth } from "../../../../Contexts/Authentication/useAuth.ts";
import ViewInvitationLinkComp from "./ViewInvitationLinkComp.tsx";
import Modal from "../../../../lib/Modal/Default/Modal.tsx";
import { createPortal } from "react-dom";
import {API_BASE_URL} from "../../../../config/api.ts";

const ViewInvitationLinksComp = (props: { onClosed: () => void }) => {

    const { token } = useAuth();
    const [invitationLinks, setInvitationLinks] = useState<InvitationLink[]>([]);

    useEffect(() => {

        const abortController = new AbortController();
        fetch(`${API_BASE_URL}/invitation`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                signal: abortController.signal,
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Could not fetch invitation links");
                }

                return res.json();
            })
            .then((res: InvitationLink[]) => {

                setInvitationLinks(res);

            })
            .catch(console.error);

        return () => abortController.abort();

    }, [token]);

    if (invitationLinks.length === 0) {
        return (
            <>
                {
                    createPortal(
                        <Modal onClosed={props.onClosed} title="Generated invitation links" modalSize="modal-small"
                               footer={null}>
                            <p style={{ color: "var(--text-color)" }}>No invitations links to see :(</p>
                        </Modal>, document.body)
                }
            </>
        )
    }

    return (
        <>
            {
                createPortal(
                    <Modal onClosed={props.onClosed} title="Generated invitation links" modalSize="modal-large"
                        footer={null}>
                        <div className="view-invitation-links-div">
                            {invitationLinks.map((invitationLink: InvitationLink, index: number) => {
                                return <ViewInvitationLinkComp invitationLink={invitationLink} key={index}/>
                            })}
                        </div>
                    </Modal>, document.body)
            }
        </>
    )

}

export default ViewInvitationLinksComp;