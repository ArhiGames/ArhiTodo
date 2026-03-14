import type {InvitationLink} from "../../../../../Models/InvitationLink.ts";
import {useAuth} from "../../../../../Contexts/Authentication/useAuth.ts";
import {useEffect, useRef, useState} from "react";
import {API_BASE_URL} from "../../../../../config/api.ts";
import InviteUserComp from "./InviteUserComp.tsx";
import ViewInvitationLinkComp from "./ViewInvitationLinkComp.tsx";
import "./InvitationLinks.css"

const AdminInvitationManagementComp = () => {

    const { checkRefresh } = useAuth();
    const [invitationLinks, setInvitationLinks] = useState<InvitationLink[]>([]);
    const scrollDownRef = useRef<HTMLDivElement>(null);

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

    }, [checkRefresh]);

    function onInvitationLinkGenerated(invitationLink: InvitationLink) {
        setInvitationLinks((prev: InvitationLink[]) => [...prev, invitationLink]);
        setTimeout(() => scrollDownRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" }), 0);
    }

    return (
        <div className="admin-settings-content admin-invitations-comp">
            <h2>Invitations</h2>
            <p>A place where you manage the invitations</p>

            <div className="view-invitation-links-div scroller">
                {invitationLinks.map((invitationLink: InvitationLink, index: number) => {
                    return <ViewInvitationLinkComp invitationLink={invitationLink} key={index}/>
                })}
                <div ref={scrollDownRef}/>
            </div>

            <nav className="user-management-nav">
                <InviteUserComp onInvitationLinkGenerated={onInvitationLinkGenerated}/>
            </nav>
        </div>
    )

}

export default AdminInvitationManagementComp;