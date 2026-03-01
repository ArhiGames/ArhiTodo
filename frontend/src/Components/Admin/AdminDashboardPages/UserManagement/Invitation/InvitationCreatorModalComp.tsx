import Modal from "../../../../../lib/Modal/Default/Modal.tsx";
import NumberInput from "../../../../../lib/Input/Number/NumberInput.tsx";
import { useState } from "react";
import {useAuth} from "../../../../../Contexts/Authentication/useAuth.ts";
import Dropdown from "../../../../../lib/Input/Dropdown/Dropdown.tsx";
import {createPortal} from "react-dom";
import GeneratedLinkInfoComp from "./GeneratedLinkInfoComp.tsx";
import type {InvitationLink} from "../../../../../Models/InvitationLink.ts";
import {API_BASE_URL} from "../../../../../config/api.ts";

interface Props {
    onClose: () => void;
}

const InvitationCreatorModalComp = (props: Props) => {

    type Option = {
        shownOption: string;
        time: number;
        expireType: number;
    }

    const options: Option[] = [
        { shownOption: "30 minutes", time: 30, expireType: 1 },
        { shownOption: "1 hour", time: 1, expireType: 2 },
        { shownOption: "3 hours", time: 3, expireType: 2 },
        { shownOption: "6 hours", time: 6, expireType: 2 },
        { shownOption: "12 hours", time: 12, expireType: 2 },
        { shownOption: "1 day", time: 1, expireType: 3 },
        { shownOption: "1 week", time: 7, expireType: 3 },
        { shownOption: "1 month", time: 30, expireType: 3 },
        { shownOption: "Never", time: 0, expireType: 0 }
    ];

    const { checkRefresh } = useAuth();
    const [maxUses, setMaxUses] = useState<number>(0);
    const [submitBlocked, setSubmitBlocked] = useState<boolean>(false);
    const [generatedInvitationLink, setGeneratedInvitationLink] = useState<InvitationLink | null>(null);
    const [currentSelectedOption, setCurrentSelectedOption] = useState<Option | undefined>(options[0]);
    const [invitationName, setInvitationName] = useState<string>("");

    function requestInvitationLink() {

        if (!currentSelectedOption) return;
        if (invitationName.length <= 0 || invitationName.length > 32) return;
        setSubmitBlocked(true);

        const abortController = new AbortController();
        const run = async () => {
            const refreshedToken: string | null = await checkRefresh();
            if (!refreshedToken || abortController.signal.aborted) return;

            fetch(`${API_BASE_URL}/invitation/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
                body: JSON.stringify( { invitationLinkName: invitationName,
                    expireType: currentSelectedOption.expireType,
                    expireNum: currentSelectedOption.time,
                    maxUses: maxUses } ),
                signal: abortController.signal
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Invitation creation failed");
                    }

                    return res.json();
                })
                .then((res: InvitationLink) => {
                    setGeneratedInvitationLink(res);
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

    }

    return (
        <>
            <Modal
                header={<h2>Creating an invitation link...</h2>}
                modalSize="modal-medium"
                onClosed={props.onClose}
                footer={
                    <>
                        <button disabled={submitBlocked} onClick={requestInvitationLink}
                                className={`button ${!submitBlocked && invitationName.length > 0 && invitationName.length <= 32 ? 
                                    "valid-submit-button" : "standard-button"}`}>Generate</button>
                        <button onClick={props.onClose} className="button standard-button">Cancel</button>
                    </>
                }>
                <div className="invitation-creator">
                    <div className="invitation-settings">
                        <h3>Link settings</h3>
                        <input className="classic-input" placeholder="Description..." required minLength={1} maxLength={32}
                               value={invitationName} onChange={(e) => setInvitationName(e.target.value)}/>
                        <h3>Expire</h3>
                        <p>Controls how long the invitation link remains valid and how often it can be used</p>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <p>Expire in</p>
                            <Dropdown onChange={(val: string) => setCurrentSelectedOption(options.find(option => option.shownOption === val))}
                                      values={options.map((option: Option) => option.shownOption)}
                                      defaultValue={options[0].shownOption}/>
                            <p style={{ opacity: "75%" }}>How long does the invitation link remain valid</p>
                        </div>
                        <div>
                            <div>
                                <p>Max uses</p>
                                <NumberInput onChange={(value: number) => setMaxUses(value)} defaultValue={1} step={1} min={0} max={50} numberForInfinite={0}/>
                            </div>
                            <p style={{ opacity: "75%" }}>Number of accounts that can be created using this link</p>
                        </div>
                    </div>
                </div>
            </Modal>
            { generatedInvitationLink && createPortal(<GeneratedLinkInfoComp onClosed={props.onClose} invitationLink={generatedInvitationLink}/>, document.body) }
        </>
    )

}

export default InvitationCreatorModalComp;