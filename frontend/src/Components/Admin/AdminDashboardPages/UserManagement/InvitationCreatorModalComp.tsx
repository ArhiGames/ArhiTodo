import Modal from "../../../../lib/Modal/Default/Modal.tsx";
import NumberInput from "../../../../lib/Input/Number/NumberInput.tsx";
import { useState } from "react";
import {useAuth} from "../../../../Contexts/Authentication/useAuth.ts";
import Dropdown from "../../../../lib/Input/Dropdown/Dropdown.tsx";
import {createPortal} from "react-dom";
import GeneratedLinkInfoComp from "./GeneratedLinkInfoComp.tsx";
import type {InvitationLink} from "../../../../Models/InvitationLink.ts";
import {API_BASE_URL} from "../../../../config/api.ts";

interface Props {
    onClose: () => void;
}

const InvitationCreatorModalComp = (props: Props) => {

    const options: string[] = ["Never", "Minutes", "Hours", "Days"];

    const { token, checkRefresh } = useAuth();
    const [expireInNum, setExpireInNum] = useState<number>(1);
    const [maxUses, setMaxUses] = useState<number>(0);
    const [submitBlocked, setSubmitBlocked] = useState<boolean>(false);
    const [currentExpireType, setCurrentExpireType] = useState<string>(options[0]);
    const [generatedInvitationLink, setGeneratedInvitationLink] = useState<InvitationLink | null>(null);

    function requestInvitationLink() {

        setSubmitBlocked(true);

        const abortController = new AbortController();

        const run = async () => {
            const succeeded = await checkRefresh();
            if (!succeeded || abortController.signal.aborted) return;

            fetch(`${API_BASE_URL}/invitation/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify( { expireType: options.indexOf(currentExpireType), expireNum: expireInNum, maxUses: maxUses } ),
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

    function onDropdownSelectionChanged(val: string) {

        setCurrentExpireType(val);

    }

    function getExpireDateStepValue() {

        switch (currentExpireType) {
            case "Minutes":
                return 5;
            case "Hours":
                return 1;
            case "Days":
                return 1;
        }
        return 1;

    }

    function getExpireDateMinValue() {

        switch (currentExpireType) {
            case "Minutes":
                return 5;
            case "Hours":
                return 1;
            case "Days":
                return 1;
        }
        return 1;

    }

    return (
        <>
            <Modal
                header={<h2>Creating an invitation link...</h2>}
                modalSize="modal-medium"
                onClosed={props.onClose}
                footer={
                    <>
                        <button disabled={submitBlocked} onClick={requestInvitationLink} className={`button ${!submitBlocked ? "valid-submit-button" : "standard-button"}`}>Generate</button>
                        <button onClick={props.onClose} className="button standard-button">Cancel</button>
                    </>
                }>
                <div className="invitation-creator">
                    <p className="warning-notice">
                        By creating an invitation link, anyone with this link can create an account for this application.
                        Please ensure your settings are configured correctly and that <strong>only people you trust</strong> receive this link.
                    </p>
                    <div className="invitation-settings">
                        <h2>Expire</h2>
                        <p>Controls how long the invitation link remains valid and how often it can be used</p>
                        <div>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <p>Expire in: </p>
                            <NumberInput onChange={(value: number) => setExpireInNum(value)}
                                                                                  defaultValue={5} step={getExpireDateStepValue()}
                                                                                  min={getExpireDateMinValue()} max={60}
                                                                                  disabled={currentExpireType === "Never"}/>
                            <Dropdown onChange={onDropdownSelectionChanged} values={options} defaultValue={options[0]}></Dropdown>
                        </span>
                            { currentExpireType === "Never" ? (
                                <p style={{ opacity: "75%" }}>The link will never expire unless manually revoked</p>
                            ) : (
                                <p style={{ opacity: "75%" }}>The link will automatically stop working after this time</p>
                            )}
                        </div>
                        <div>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <p>Max uses: </p>
                            <NumberInput onChange={(value: number) => setMaxUses(value)} defaultValue={1} step={1} min={0} max={50} numberForInfinite={0}/>
                        </span>
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