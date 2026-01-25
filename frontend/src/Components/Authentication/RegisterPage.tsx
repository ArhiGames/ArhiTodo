import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {type ChangeEvent, type FormEvent, useState} from "react";

const RegisterPage = () => {

    const navigate = useNavigate();
    const { register } = useAuth();
    const { invitationKey } = useParams();
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmedPassword, setConfirmedPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const isValidInput = (password.length >= 8 && password === confirmedPassword);

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        if (!invitationKey || !isValidInput) return;

        try {
            const succeeded = await register(userName, email, password, invitationKey);
            if (succeeded) {
                navigate("/login");
            }
        }
        catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unknown error occurred");
            }
        }

    }

    function onUserNameChanged(e: ChangeEvent<HTMLInputElement>)  {
        setUserName(e.target.value);
        setError(null);
    }

    function onEmailChanged(e: ChangeEvent<HTMLInputElement>)  {
        setEmail(e.target.value);
        setError(null);
    }

    function onPasswordChanged(e: ChangeEvent<HTMLInputElement>)  {
        setPassword(e.target.value.trim());
        setError(null);
    }

    function onConfirmedPasswordChanged(e: ChangeEvent<HTMLInputElement>)  {
        setConfirmedPassword(e.target.value.trim());
        setError(null);
    }

    return (
        <div className="login-page">
            <div className="login" style={{ minWidth: "520px" }}>
                <h2>Register via invitation link</h2>
                { error && <p>{error}</p> }
                <form onSubmit={onFormSubmit}>
                    <label>Username</label>
                    <input value={userName} onChange={onUserNameChanged}
                           required type="text" placeholder="Enter your username..."/>
                    <label>Email</label>
                    <input value={email} onChange={onEmailChanged}
                           required type="text" placeholder="Enter your email..."/>
                    <label>Password</label>
                    <input value={password} onChange={onPasswordChanged}
                           required minLength={8} type="password" placeholder="Enter your password..."/>
                    <input value={confirmedPassword} onChange={onConfirmedPasswordChanged}
                           required minLength={8} type="password" placeholder="Confirm your password..."/>
                    <button disabled={!isValidInput} className={`button ${isValidInput ? "valid-submit-button" : "standard-button"}`} type="submit">Register</button>
                </form>
            </div>
        </div>
    )

}

export default RegisterPage;