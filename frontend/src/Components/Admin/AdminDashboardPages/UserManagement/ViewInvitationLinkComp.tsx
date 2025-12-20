import type { InvitationLink } from "../../../../Models/InvitationLink.ts";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../Contexts/useAuth.ts";
import { formatRemainingTime } from "../../../../lib/Functions.ts";
import TagComp from "../../../../lib/Tags/TagComp.tsx";

interface Props {
    invitationLink: InvitationLink;
}

const ViewInvitationLinkComp = ( { invitationLink }: Props ) => {

    const { token } = useAuth();
    const [remainingMs, setRemainingMs] = useState<number>(0);

    // eslint-disable-next-line react-hooks/purity
    const isExpired: boolean = Date.now() > new Date(invitationLink.expiresDate).getTime()
    const used: boolean = invitationLink.maxUses <= invitationLink.uses;
    const isUsable: boolean = invitationLink.isActive && !isExpired && !used;
    const keyStatus: { tag: string, color: "red" | "green" | "orange" | "blue" | "gray" } = {
        tag: !invitationLink.isActive ? "Invalid" : used ? "Used" : isExpired ? "Expired" : isUsable ? "Active" : "Unusable",
        color: !invitationLink.isActive ? "red" : used ? "orange" : isExpired ? "orange" : isUsable ? "green" : "gray",
    }

    useEffect(() => {

        const interval = setInterval(() => {
            setRemainingMs(
                new Date(invitationLink.expiresDate).getTime() - Date.now()
            );
        }, 1000);

        return () => clearInterval(interval);

    }, [invitationLink.expiresDate]);

    function onInvalidateButtonPressed() {

        const abortController = new AbortController();
        fetch(`https://localhost:7069/api/invitation/invalidate/${invitationLink.invitationLinkId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                signal: abortController.signal
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Invitation link could not be invalidated");
                }

                invitationLink.isActive = false;
            })
            .catch(console.error);

        return () => abortController.abort();

    }

    return (
        <div className="view-invitation-link-div">
            <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <TagComp tag={keyStatus.tag} color={keyStatus.color}/>
                    <h3 style={{ marginLeft: "0.5rem" }}>Key: {invitationLink.invitationKey}</h3>
                </div>
                <p style={{ marginTop: "0.35rem" }}>
                    Expires in: {new Date(invitationLink.createdDate).getTime() - new Date(invitationLink.expiresDate).getTime() === 0 ?
                    "Never" : formatRemainingTime(remainingMs)}</p>
                <p>Max uses: {invitationLink.maxUses === 0 ? "Infinite" : invitationLink.maxUses}</p>
                <p>Uses: {invitationLink.uses}</p>
            </div>
            { invitationLink.isActive && <button onClick={onInvalidateButtonPressed}
                                                 style={{ width: "fit-content", marginLeft: "auto" }}
                                                 className="button standard-button">Invalidate</button> }
        </div>
    )

}

export default ViewInvitationLinkComp;