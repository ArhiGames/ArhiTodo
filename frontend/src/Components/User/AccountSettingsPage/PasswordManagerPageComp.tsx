import {type FormEvent, useRef, useState} from "react";
import {useAuth} from "../../../Contexts/Authentication/useAuth.ts";
import {AUTH_BASE_URL} from "../../../config/api.ts";
import type {Error, PasswordAuthorizerResult} from "../../../Models/BackendDtos/Auth/PasswordAuthorizerResult.ts";

const PasswordManagerPageComp = () => {

    const { logout, checkRefresh } = useAuth();
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
    const [errors, setErrors] = useState<Error[]>([]);

    async function changePassword() {

        if ((currentPassword.length < 8 && currentPassword !== "admin") || password.length < 8 || password !== confirmPassword) return;

        const refreshedToken: string | null = await checkRefresh();
        if (!refreshedToken) return;

        fetch(`${AUTH_BASE_URL}/account/change/password`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${refreshedToken}` },
            body: JSON.stringify({ oldPassword: currentPassword, newPassword: password }),
        })
            .then(res => {
                if (res.ok) {
                    logout(false);
                }
                return res.json();
            })
            .then((passwordAuthorizerResult: PasswordAuthorizerResult) => {
                setErrors(passwordAuthorizerResult.errors);
            })

    }

    function onHandleSubmit(e: FormEvent<HTMLFormElement>) {

        e.preventDefault();

        if (password !== confirmPassword) {
            setConfirmPassword("");
            confirmPasswordInputRef.current?.focus();
            return;
        }

        changePassword();

    }

    return (
        <div className="account-settings-content account-pwsmanager-page">
            <h2>Password manager</h2>
            <p>Change your password</p>
            <form onSubmit={onHandleSubmit}>
                <label>Current password</label>
                <input required className="classic-input" value={currentPassword} type="password"
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
                { errors.length > 0 && errors.map((error: Error) => (
                    <p className="error-text">{error.type}: {error.message}</p>
                )) }
                <button type="submit" className={`button ${ (currentPassword.length >= 8 || currentPassword === "admin") && 
                    password.length >= 8 && password === confirmPassword ? 
                    "valid-submit-button" : "standard-button" }`}>
                    Change password
                </button>
            </form>
        </div>
    )

}

export default PasswordManagerPageComp;