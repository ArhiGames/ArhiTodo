import "./ConfirmationModal.css"
import { type FormEvent, useState } from "react";

interface Props {
    onConfirmed: (password?: string) => void;
    onClosed: () => void;
    title: string;
    actionDescription: string;
    requirePassword?: boolean;
}

const ConfirmationModal = (props: Props) => {

    const [currentPassword, setCurrentPassword] = useState<string>("");

    function handleConfirmed(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();
        props.onConfirmed(currentPassword);

    }

    function handleClosed() {

        props.onClosed();

    }

    return (
        <div className="conf-modal-background" onClick={handleClosed}>
            <div onClick={(e) => e.stopPropagation()} className="conf-modal-container">
                <div className="conf-modal-header">
                    <h2>{props.title}</h2>
                </div>

                <div className="conf-modal-body">
                    <p>{props.actionDescription}</p>
                    <form onSubmit={handleConfirmed}>
                        { props.requirePassword &&
                            <div className="conf-modal-required-password">
                                <label>Password</label>
                                <input minLength={8} type="password" className="classic-input" style={{ width: "100%" }} placeholder="Enter your password..."
                                    value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                            </div>
                        }
                        <div className="conf-form-footer">
                            <button type="submit" className={`button ${currentPassword.length >= 8 ? "valid-submit-button" : "standard-button"}`}>Confirm</button>
                            <button className="button standard-button" onClick={handleClosed}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default ConfirmationModal;