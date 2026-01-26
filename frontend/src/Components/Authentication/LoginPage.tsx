import {type ChangeEvent, type FormEvent, useState} from "react";
import { useAuth } from "../../Contexts/Authentication/useAuth.ts";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    const navigate = useNavigate();
    const { login } = useAuth();
    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {

        if (userName.length <= 0 || (password.length <= 8 && password !== "admin")) return;

        e.preventDefault();
        try {
            await login(userName, password);
            navigate("/");
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

    function onPasswordChanged(e: ChangeEvent<HTMLInputElement>)  {

        setPassword(e.target.value);
        setError(null);

    }

    return (
        <div className="login-page">
            <div className="login">
                <h2>Login</h2>
                { error && <p>{error}</p> }
                <form onSubmit={onFormSubmit}>
                    <label>Username</label>
                    <input value={userName} onChange={onUserNameChanged}
                           required type="text" placeholder="Enter your username..."></input>
                    <label>Password</label>
                    <input value={password} onChange={onPasswordChanged}
                        required minLength={1} type="password" placeholder="Enter your password..."></input>
                    <button className={`button ${password.length >= 8 || password === "admin" ? "valid-submit-button" : "standard-button"}`} type="submit">Login</button>
                </form>
            </div>
        </div>
    )

}

export default LoginPage;