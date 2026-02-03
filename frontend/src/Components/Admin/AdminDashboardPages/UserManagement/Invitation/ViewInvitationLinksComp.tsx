import { useEffect, useState } from "react";
import type { InvitationLink } from "../../../../../Models/InvitationLink.ts";
import { useAuth } from "../../../../../Contexts/Authentication/useAuth.ts";
import ViewInvitationLinkComp from "./ViewInvitationLinkComp.tsx";
import Modal from "../../../../../lib/Modal/Default/Modal.tsx";
import { createPortal } from "react-dom";
import {API_BASE_URL} from "../../../../../config/api.ts";
import "./InvitationLinks.css"

const ViewInvitationLinksComp = (props: { onClosed: () => void }) => {

    const { token, checkRefresh } = useAuth();
    const [invitationLinks, setInvitationLinks] = useState<InvitationLink[]>([]);

    useEffect(() => {

        const abortController = new AbortController();

        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            fetch(`${API_BASE_URL}/invitation`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
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
                .catch(err => {
                    if (err.name === "AbortError") {
                        return;
                    }
                    console.error(err);
                });
        }

        run();

        return () => abortController.abort();

    }, [checkRefresh, token]);

    if (invitationLinks.length === 0) {
        return (
            <>
                {
                    createPortal(
                        <Modal onClosed={props.onClosed} header={<h2>Generated invitation links</h2>} modalSize="modal-small"
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
                    <Modal onClosed={props.onClosed} header={<h2>Generated invitation links</h2>} modalSize="modal-large"
                        footer={null}>
                        <div className="view-invitation-links-div scroller">
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