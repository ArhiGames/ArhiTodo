import Modal from "../../../../lib/Modal/Default/Modal.tsx";
import NumberInput from "../../../../lib/Input/Number/NumberInput.tsx";

interface Props {
    onClose: () => void;
}

const InvitationCreatorModalComp = (props: Props) => {

    return (
        <Modal
            title="Creating an invitation link..."
            onClosed={props.onClose}
            footer={
                <>
                    <button className="button valid-submit-button">Generate</button>
                    <button onClick={props.onClose} className="button standard-button">Abort</button>
                </>
            }>
            <div className="invitation-creator">
                <p className="warning-notice">
                    By creating an invitation link, anyone with this link can create an account for this application.
                    Please ensure your settings are configured correctly and that <strong>only people you trust</strong> receive this link.
                </p>
                <form>
                    <h2>Expire</h2>
                    <span>
                        <label>Expire in: </label>
                        <NumberInput defaultValue={5} step={5} min={5} max={60}/>
                    </span>
                    <span>
                        <label>Max uses: </label>
                        <NumberInput defaultValue={1} step={1} min={0} max={50} numberForInfinite={0}/>
                    </span>

                </form>
            </div>
        </Modal>
    )

}

export default InvitationCreatorModalComp;