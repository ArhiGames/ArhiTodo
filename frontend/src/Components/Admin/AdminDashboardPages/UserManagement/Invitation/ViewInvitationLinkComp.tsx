import type { InvitationLink } from "../../../../../Models/InvitationLink.ts";
import {useEffect, useRef, useState} from "react";
import { useAuth } from "../../../../../Contexts/Authentication/useAuth.ts";
import { formatRemainingTime } from "../../../../../lib/Functions.ts";
import TagComp from "../../../../../lib/Tags/TagComp.tsx";
import {API_BASE_URL} from "../../../../../config/api.ts";
import Popover from "../../../../../lib/Popover/Popover.tsx";
import GeneralUserViewerComp from "../../../../User/GeneralUserViewerComp.tsx";
import type {Claim} from "../../../../../Models/Claim.ts";

interface Props {
    invitationLink: InvitationLink;
}

const ViewInvitationLinkComp = ( { invitationLink }: Props ) => {

    const origin = window.location.origin;
    const finalUrl = `${origin}/register/${invitationLink.invitationKey}`;
    const { checkRefresh } = useAuth();

    // eslint-disable-next-line react-hooks/purity
    const [remainingMs, setRemainingMs] = useState<number>(new Date(invitationLink.expiresDate).getTime() - Date.now());
    const [copied, setCopied] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);
    const userNameRef = useRef<HTMLParagraphElement>(null);

    // eslint-disable-next-line react-hooks/purity
    const isExpired: boolean = new Date(invitationLink.expiresDate).getTime() !== 0 && Date.now() > new Date(invitationLink.expiresDate).getTime();
    const used: boolean = invitationLink.maxUses !== 0 && invitationLink.maxUses <= invitationLink.uses;
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

    async function onInvalidateButtonPressed() {

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${API_BASE_URL}/invitation/invalidate/${invitationLink.invitationLinkId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Invitation link could not be invalidated");
                }

                invitationLink.isActive = false;
            })
            .catch(console.error);

    }

    async function onCopyLinkPressed() {

        if (copied) return;

        await navigator.clipboard.writeText(finalUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="view-invitation-link-div">
            <div className="invitation-information">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <TagComp tag={keyStatus.tag} color={keyStatus.color}/>
                    <h3 style={{ marginLeft: "0.5rem" }}>Description: {invitationLink.invitationLinkName}</h3>
                </div>
                <p style={{ marginTop: "0.35rem" }}>
                    Expires in: { new Date(invitationLink.expiresDate).getTime() === 0 ? "Never" : formatRemainingTime(remainingMs)}</p>
                <p>Max uses: {invitationLink.maxUses === 0 ? "Infinite" : invitationLink.maxUses}</p>
                <p>Uses: {invitationLink.uses}</p>
                <p ref={userNameRef} onPointerEnter={() => setIsHovering(true)}
                   onPointerLeave={() => setIsHovering(false)}>Created by: {invitationLink.createdByUser.userName}</p>
                {isHovering && (
                    <Popover close={() => setIsHovering(false)} element={userNameRef} triggerElement={userNameRef}>
                        <GeneralUserViewerComp user={invitationLink.createdByUser} options={{ showProjectOwner: false, showBoardOwner: false }}/>
                    </Popover>
                )}
                {invitationLink.defaultInvitationClaims.length > 0 && (
                    <p>Permissions: {invitationLink.defaultInvitationClaims.map((permissionClaim: Claim) => permissionClaim.claimType).toString()}</p>
                )}
            </div>
            { invitationLink.isActive &&
                <div className="invitation-actions">
                    <button onClick={onCopyLinkPressed} className="button standard-button">{ copied ? "Copied" : "Copy" }</button>
                    <button onClick={onInvalidateButtonPressed} className="button standard-button">Remove</button>
                </div>
            }
        </div>
    )

}

export default ViewInvitationLinkComp;