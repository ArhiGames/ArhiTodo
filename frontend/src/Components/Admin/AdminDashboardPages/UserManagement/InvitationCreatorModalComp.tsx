import Modal from "../../../../lib/Modal/Default/Modal.tsx";
import NumberInput from "../../../../lib/Input/Number/NumberInput.tsx";
import { useState } from "react";
import {useAuth} from "../../../../Contexts/useAuth.ts";

interface Props {
    onClose: () => void;
}

const InvitationCreatorModalComp = (props: Props) => {

    const { token } = useAuth();
    const [expireInNum, setExpireInNum] = useState<number>(0);
    const [maxUses, setMaxUses] = useState<number>(0);
    const [submitBlocked, setSubmitBlocked] = useState<boolean>(false);

    function requestInvitationLink() {

        setSubmitBlocked(true);

        const abortController = new AbortController();
        fetch(`https://localhost:7069/api/invitation/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify( { expireType: 0, expireNum: expireInNum, maxUses: maxUses } ),
            signal: abortController.signal
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Invitation creation failed");
                }

                return res.json();
            })
            .catch(console.error);

        return () => abortController.abort();

    }

    return (
        <Modal
            title="Creating an invitation link..."
            onClosed={props.onClose}
            footer={
                <>
                    <button disabled={submitBlocked} onClick={requestInvitationLink} className={`button ${!submitBlocked ? "valid-submit-button" : "standard-button"}`}>Generate</button>
                    <button onClick={props.onClose} className="button standard-button">Abort</button>
                </>
            }>
            <div className="invitation-creator">
                <p className="warning-notice">
                    By creating an invitation link, anyone with this link can create an account for this application.
                    Please ensure your settings are configured correctly and that <strong>only people you trust</strong> receive this link.
                </p>
                <div className="invitation-settings">
                    <h2>Expire</h2>
                    <span>
                        <label>Expire in: </label>
                        <NumberInput onChange={(value: number) => setExpireInNum(value)} defaultValue={5} step={5} min={5} max={60}/>
                    </span>
                    <span>
                        <label>Max uses: </label>
                        <NumberInput onChange={(value: number) => setMaxUses(value)} defaultValue={1} step={1} min={0} max={50} numberForInfinite={0}/>
                    </span>
                </div>
            </div>
        </Modal>
    )

}

export default InvitationCreatorModalComp;