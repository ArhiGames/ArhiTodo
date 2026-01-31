import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../Contexts/Authentication/useAuth.ts";
import {type ChangeEvent, type FormEvent, useState} from "react";
import type {PasswordAuthorizerResult} from "../../Models/BackendDtos/Auth/PasswordAuthorizerResult.ts";
import type { Error } from "../../Models/BackendDtos/Auth/PasswordAuthorizerResult.ts"
import "./Login.css"

const RegisterPage = () => {

    const navigate = useNavigate();
    const { register } = useAuth();
    const { invitationKey } = useParams();
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmedPassword, setConfirmedPassword] = useState<string>("");
    const [errors, setErrors] = useState<Error[]>([]);

    const isValidInput = (password.length >= 8 && password === confirmedPassword);

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        if (!invitationKey || !isValidInput) return;

        try {
            const result: PasswordAuthorizerResult = await register(userName, email, password, invitationKey);
            if (result.succeeded) {
                navigate("/login");
            } else {
                setErrors(result.errors);
            }
        }
        catch (e: unknown) {
            if (e instanceof Error) {
                setErrors([ { type: "UnknownError", message: e.message } ]);
            } else {
                setErrors([ { type: "UnknownError", message: "An unknown error occurred" } ]);
            }
        }

    }

    function onUserNameChanged(e: ChangeEvent<HTMLInputElement>)  {
        setUserName(e.target.value);
        setErrors([]);
    }

    function onEmailChanged(e: ChangeEvent<HTMLInputElement>)  {
        setEmail(e.target.value);
        setErrors([]);
    }

    function onPasswordChanged(e: ChangeEvent<HTMLInputElement>)  {
        setPassword(e.target.value.trim());
        setErrors([]);
    }

    function onConfirmedPasswordChanged(e: ChangeEvent<HTMLInputElement>)  {
        setConfirmedPassword(e.target.value.trim());
        setErrors([]);
    }

    return (
        <div className="login-page">
            <div className="login" style={{ minWidth: "520px", maxWidth: "720px" }}>
                <h2>Register via invitation link</h2>
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
                    { errors.length > 0 && errors.map((error: Error) => (
                        <p className="error-text">{error.type}: {error.message}</p>
                    )) }
                    <button className={`button ${isValidInput ? "valid-submit-button" : "standard-button"}`} type="submit">Register</button>
                </form>
            </div>
        </div>
    )

}

export default RegisterPage;