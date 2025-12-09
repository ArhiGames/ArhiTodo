import {type FormEvent, useRef, useState} from "react";

const PasswordManagerPageComp = () => {

    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

    function onHandleSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        if (password !== confirmPassword) {
            setConfirmPassword("");
            confirmPasswordInputRef.current?.focus();
            return;
        }



    }

    return (
        <div className="account-settings-content account-pwsmanager-page">
            <h2>Password manager</h2>
            <p>Change your password</p>
            <form onSubmit={onHandleSubmit}>
                <label>Current password</label>
                <input required minLength={8} className="classic-input" value={currentPassword} type="password"
                       onChange={(e) => setCurrentPassword(e.target.value)}
                       placeholder="Enter your current password..."></input>
                <label>New password</label>
                <input required minLength={8} className="classic-input" value={password} type="password"
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Enter your new password..."></input>
                <label>Confirm new password</label>
                <input required minLength={8} className="classic-input" value={confirmPassword} type="password"
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       placeholder="Confirm your new password..."
                       ref={confirmPasswordInputRef}>
                </input>
                <button type="submit" className="submit-button">Change password</button>
            </form>
        </div>
    )

}

export default PasswordManagerPageComp;